// src/pages/StockPage.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const API_URL = "/data/stock_analysis.json";
const CHART_PATH = "/charts/";

export default function StockPage() {
  const { symbol } = useParams();
  const [stock, setStock] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((s) => s.股票 === symbol);
        setStock(found);
      });
  }, [symbol]);

  if (!stock) return <div className="text-white p-6 bg-[#0d1117]">載入中...</div>;

  return (
    <div className="text-white p-6 bg-[#0d1117] min-h-screen">
      <button
        className="text-blue-400 underline mb-4"
        onClick={() => window.history.back()}
      >
        ← 返回排行
      </button>

      <h1 className="text-3xl font-bold mb-2">{stock.股票} 分析圖表</h1>
      <p className="mb-4">綜合建議：{stock.綜合建議 ?? "--"}</p>
      <img
        src={`${CHART_PATH}${symbol}.png`}
        alt={`${symbol} 線圖`}
        className="w-full max-w-3xl border rounded-xl mb-6"
      />

      <div className="text-gray-400 text-sm">
        📊 趨勢：{stock.趨勢}｜均線交叉：{stock.均線交叉}
        <br />
        🤖 AI 語錄：{stock.AI語錄 ?? "AI 分析語錄尚未生成"}
      </div>
    </div>
  );
}
