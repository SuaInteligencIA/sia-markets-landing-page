// Original badge artwork from the previous site's src/components/ui/sia-badge.tsx.
// Keep its typography, emblem and gradient with a lightweight CSS hover treatment.
export function PoweredBadge({ href }: { href: string }) {
  return <a className="powered-badge" href={href} target="_blank" rel="noopener noreferrer"><span className="powered-badge-copy"><span>PRODUTO ABASTECIDO PELA TECNOLOGIA DA</span><strong>SUA INTELIGÊNC<em>[IA]</em></strong></span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 64" width="320" height="64" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="siaBadgeBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0d1b3e" />
              <stop offset="100%" stopColor="#0a0a1a" />
            </linearGradient>
          </defs>
          {/* Background */}
          <rect width="320" height="64" rx="12" fill="url(#siaBadgeBg)" />
          {/* Inner border */}
          <rect x="3" y="3" width="314" height="58" rx="10" fill="transparent" stroke="rgba(45,95,254,0.25)" strokeWidth="1" />
          {/* SIA Icon */}
          <g transform="translate(12, 10) scale(0.022)">
            <path d="M805.74,1288.84c-3.37,0-6.7.14-10.02.35l.03-.03c-60.29,3.84-112.29-41.93-116.12-102.22l-.03.03c-4.68-74.73-66.73-133.9-142.64-133.9s-142.96,64-142.96,142.96,64,142.96,142.96,142.96c.42,0,.83-.03,1.25-.03l-.02.03c60.41-.52,109.81,48.04,110.33,108.45l.03-.03c.71,86.23,70.81,155.92,157.21,155.92s157.24-70.4,157.24-157.24-70.4-157.24-157.24-157.24Z" fill="#2d5ffe" />
            <circle cx="805.74" cy="1000" r="142.96" fill="#2d5ffe" />
            <path d="M805.74,396.68c-86.4,0-156.5,69.69-157.21,155.92l-.03-.03c-.52,60.41-49.91,108.97-110.33,108.45l.02.03c-.42,0-.83-.03-1.25-.03-78.95,0-142.96,64-142.96,142.96s64,142.96,142.96,142.96,137.97-59.17,142.64-133.9l.03.03c3.84-60.29,55.83-106.06,116.12-102.22l-.03-.03c3.32.21,6.65.35,10.02.35,86.84,0,157.24-70.4,157.24-157.24s-70.4-157.24-157.24-157.24Z" fill="#2d5ffe" />
            <path d="M1463.04,1053.06c-75.91,0-137.97,59.17-142.64,133.9l-.03-.03c-3.84,60.29-55.83,106.06-116.12,102.22l.03.03c-3.32-.21-6.65-.35-10.02-.35-86.84,0-157.24,70.4-157.24,157.24s70.4,157.24,157.24,157.24,156.5-69.69,157.21-155.92l.03.03c.52-60.41,49.91-108.97,110.33-108.45l-.02-.03c.42,0,.83.03,1.25.03,78.95,0,142.96-64,142.96-142.96s-64-142.96-142.96-142.96Z" fill="#2d5ffe" />
            <circle cx="1194.26" cy="1000" r="142.96" fill="#2d5ffe" />
            <path d="M1194.26,711.16c3.37,0,6.7-.14,10.02-.35l-.03.03c60.29-3.84,112.29,41.93,116.12,102.22l.03-.03c4.68,74.73,66.73,133.9,142.64,133.9s142.96-64,142.96-142.96-64-142.96-142.96-142.96c-.42,0-.83.03-1.25.03l.02-.03c-60.41.52-109.81-48.04-110.33-108.45l-.03.03c-.71-86.23-70.81-155.92-157.21-155.92s-157.24,70.4-157.24,157.24,70.4,157.24,157.24,157.24Z" fill="#2d5ffe" />
          </g>
          </svg></a>;
}
