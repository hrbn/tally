import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

import '@fontsource/public-sans';
import '@fontsource/ibm-plex-mono/latin-400.css';
import '@fontsource/ibm-plex-mono/latin-400-italic.css';
import '@fontsource/ibm-plex-mono/latin-700.css';
import '@fontsource/ibm-plex-mono/latin-700-italic.css';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
