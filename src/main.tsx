
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { setupPWAInstallPrompt } from './utils/pwa-utils.ts';

// Setup PWA installation prompt
setupPWAInstallPrompt();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
