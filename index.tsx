
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Prevent app from crashing on unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
});

// Handle global errors to prevent white screen
window.onerror = (message, source, lineno, colno, error) => {
  console.error('Global Error:', { message, source, lineno, colno, error });
  return false;
};

// Fixed Service Worker registration logic
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Only register if we are on a secure origin and not in a restricted preview environment
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const isHttps = window.location.protocol === 'https:';
    
    // Using a simple relative path './sw.js' is safer for most environments
    if (isHttps || isLocalhost) {
      navigator.serviceWorker.register('./sw.js', { scope: './' })
        .then(registration => {
          console.log('AD Stream SW Registered successfully');
        })
        .catch(err => {
          // Log only warning to not trigger error overlays in preview modes
          console.warn('PWA ServiceWorker registration skipped:', err.message);
        });
    }
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
