import React from 'react';
import { createRoot } from 'react-dom/client';
import Dashboard from './Dashboard';  // 正確路徑

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Dashboard />
  </React.StrictMode>
);
