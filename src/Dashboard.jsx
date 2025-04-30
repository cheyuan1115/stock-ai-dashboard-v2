// src/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "/data/stock_analysis.json";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  const categories = {
    上升: [],
    下降: [],
    不明: []
  };

  data.forEach((stock) => {
    if (categories[stock.趨勢]) {
      categories[stock.趨勢].push(stock);
    } else {
      categories["不明"].push(stock);
    }
  });

  return (
    <div className="p-6 text-white bg-[#0d1117] min-h-screen">
      <h1 className="text-3xl font-bold mb-6">📊 AI 股票趨勢排行榜</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(categories).map(([key, stocks]) => (
          <div key={key} className="bg-[#161b22] p-4 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">{key} 趨勢</h2>
            {stocks.map((s) => (
              <div
                key={s.股票}
                className="flex justify-between items-center p-2 hover:bg-[#21262d] rounded cursor-pointer"
                onClick={() => navigate(`/stock/${s.股票}`)}
              >
                <span className="text-blue-400">{s.股票}</span>
                <span className="text-sm">{s.建議買進機率 ?? "--"}%</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
