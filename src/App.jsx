// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import StockPage from "./pages/StockPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/stock/:symbol" element={<StockPage />} />
      </Routes>
    </BrowserRouter>
  );
}
