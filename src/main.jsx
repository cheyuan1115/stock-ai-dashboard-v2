import React from 'react'
import { createRoot } from 'react-dom/client'  // ← 這一行改正
import StockDashboard from './pages/Dashboard'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StockDashboard />
  </React.StrictMode>
)
