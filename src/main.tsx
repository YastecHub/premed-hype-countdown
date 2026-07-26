import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerServiceWorker, checkForUpdateAndClearCache } from './lib/sw-register';

// Run version/cache validation before boot
checkForUpdateAndClearCache().then(() => {
  // Register Service Worker for notifications
  registerServiceWorker();

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
