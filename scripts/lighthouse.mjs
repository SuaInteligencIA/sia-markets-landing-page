import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import { chromium } from 'playwright';

const lighthouseRequire = createRequire(import.meta.resolve('lighthouse'));
const { launch } = await import(pathToFileURL(lighthouseRequire.resolve('chrome-launcher')).href);
const url = process.env.LIGHTHOUSE_URL || 'http://127.0.0.1:4175/markets/';
const label = process.argv[2] || 'latest';
const profiles = process.argv[3] ? [process.argv[3]] : ['mobile', 'desktop'];
const directory = path.resolve('docs/lighthouse');
await fs.mkdir(directory, { recursive: true });
const summary = [];

for (const profile of profiles) {
  const chrome = await launch({
    chromePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    chromeFlags: ['--headless', '--no-first-run', '--disable-extensions'],
  });
  try {
    // Initialize Chrome's networking before the measured navigation. Lighthouse
    // still clears its browser cache and storage for each cold-cache audit.
    const connection = await chromium.connectOverCDP(`http://127.0.0.1:${chrome.port}`);
    const warmup = await connection.newPage();
    await warmup.goto(url, { waitUntil: 'networkidle' });
    await warmup.close();
    const result = await lighthouse(url, {
      port: chrome.port,
      output: ['html', 'json'],
      logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    }, profile === 'desktop' ? desktopConfig : undefined);
    if (!result) throw new Error('Lighthouse did not return a report.');
    const prefix = path.join(directory, `${label}-${profile}`);
    await fs.writeFile(`${prefix}.html`, result.report[0]);
    await fs.writeFile(`${prefix}.json`, result.report[1]);
    const { lhr } = result;
    const entry = {
      profile, url, fetchTime: lhr.fetchTime, lighthouseVersion: lhr.lighthouseVersion,
      scores: Object.fromEntries(Object.entries(lhr.categories).map(([name, category]) => [name, Math.round(category.score * 100)])),
      metrics: Object.fromEntries(['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift', 'speed-index'].map(name => [name, lhr.audits[name].numericValue])),
      failedAudits: Object.entries(lhr.audits).filter(([, audit]) => audit.score !== null && audit.score < 1).map(([id, audit]) => ({ id, title: audit.title, score: audit.score, displayValue: audit.displayValue })),
    };
    summary.push(entry);
    console.log(JSON.stringify(entry, null, 2));
  } finally {
    // Windows can briefly retain Chrome's temporary profile files after exit.
    // Keep the completed audit even when the launcher's temp cleanup hits EPERM.
    try { await chrome.kill(); } catch (error) {
      if (error.code !== 'EPERM') throw error;
      console.warn('Chrome closed; Windows deferred temporary profile cleanup.');
    }
  }
}
await fs.writeFile(path.join(directory, `${label}-summary.json`), JSON.stringify(summary, null, 2) + '\n');
