// stock-dashboard-v3 (新版本：深色主題＋分析圖表頁面)

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";

const API_URL = "/data/stock_analysis.json";
const CHART_BASE = "/charts/";

export default function StockDashboard() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(json => {
        setData(json);
        const target = searchParams.get("symbol");
        if (target) {
          const found = json.find((d) => d["股票"] === target);
          if (found) setSelected(found);
        }
      });
  }, [searchParams]);

  if (!selected) {
    return (
      <div className="p-4 text-white bg-[#0d1117] min-h-screen">
        <h1 className="text-2xl font-bold mb-4">AI 股票趨勢排行榜</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.map((stock) => (
            <div
              key={stock["股票"]}
              className="p-4 bg-[#161b22] rounded-xl cursor-pointer hover:bg-[#21262d]"
              onClick={() => (window.location.href = `?symbol=${stock["股票"]}`)}
            >
              <div className="text-lg font-semibold">{stock["股票"]}</div>
              <div className="text-sm text-gray-400">{stock["趨勢"]}</div>
              <div className="text-sm text-gray-400">收盤價：{stock["最新收盤價"]}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 text-white bg-[#0d1117] min-h-screen">
      <button onClick={() => setSelected(null)} className="mb-4 text-blue-400 hover:underline">← 返回清單</button>
      <h1 className="text-2xl font-bold mb-2">{selected["股票"]} 詳細分析</h1>
      <p className="text-lg mb-4">綜合建議：{selected["綜合建議"]}</p>

      <div className="mb-6">
        <img
          src={`${CHART_BASE}${selected["股票"]}.png`}
          alt={`${selected["股票"]} 線圖`}
          className="rounded-xl border border-gray-600 w-full"
        />
      </div>

      <div className="text-sm text-gray-400">資料來源：Yahoo Finance / AI 分析每日更新</div>
    </div>
  );
}
