import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";

const API_URL = "/data/stocks.json";

export default function StockDashboard() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(json => setData(json));
  }, []);

  const categories = {
    上升: data.filter((d) => d.趨勢分類 === "上升"),
    下降: data.filter((d) => d.趨勢分類 === "下降"),
    不明: data.filter((d) => d.趨勢分類 === "不明"),
  };

  return (
    <div style={{ backgroundColor: '#0f172a', color: 'white', minHeight: '100vh', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>AI 股票趨勢分析排行榜</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        {Object.entries(categories).map(([label, list]) => (
          <div key={label} style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '8px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{label}趨勢</h2>
            {list.sort((a, b) => b["建議買進機率(%)"] - a["建議買進機率(%)"])
              .slice(0, 10)
              .map((stock) => (
                <div key={stock.股票代碼} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <button onClick={() => setSelected(stock)} style={{ color: '#93c5fd', background: 'none', border: 'none' }}>
                    {stock.股票代碼}
                  </button>
                  <span>{stock["建議買進機率(%)"]}%</span>
                </div>
              ))}
          </div>
        ))}
      </div>

      {selected && (
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{selected.股票代碼} 詳細分析</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '8px', flex: 1, minWidth: '300px' }}>
              <h3>建議與趨勢</h3>
              <p>
                {selected.趨勢分類}趨勢，
                近30日漲跌幅：{selected["近30日漲跌幅(%)"]}%
                ，成交量變化比：{selected["成交量變化(7/30)"]}
                <br />
                建議買進機率：{selected["建議買進機率(%)"]}%
                ，賣出機率：{selected["建議賣出機率(%)"]}%
              </p>
            </div>
            <div style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '8px', flex: 1, minWidth: '300px' }}>
              <h3>趨勢強度圖</h3>
              <BarChart width={300} height={200} data={[selected]}>
                <XAxis dataKey="股票代碼" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Bar dataKey="建議買進機率(%)" fill="#22c55e" />
                <Bar dataKey="建議賣出機率(%)" fill="#ef4444" />
              </BarChart>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
