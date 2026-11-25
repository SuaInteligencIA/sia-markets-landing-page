import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import './updates.css';
import './hero-blend.css';
import './markets.css';

const root = document.getElementById('root')!;
const application = <React.StrictMode><App /></React.StrictMode>;

// The production build ships real HTML. Hydration preserves it and attaches
// interactions; Vite's development page starts with an empty root instead.
if (root.hasChildNodes()) ReactDOM.hydrateRoot(root, application);
else ReactDOM.createRoot(root).render(application);
