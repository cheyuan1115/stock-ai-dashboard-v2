// Dashboard.jsx (v3 乾淨版)
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Modal } from "antd";

const API_URL = "/data/stock_analysis.json";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  const openModal = (stock) => {
    setSelected(stock);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelected(null);
  };

  const categories = {
    上升: [],
    下降: [],
    不明: [],
  };

  data.forEach((d) => {
    categories[d.趨勢]?.push(d);
  });

  return (
    <div className="p-6 text-white bg-[#0d1117] min-h-screen">
      <h1 className="text-3xl font-bold mb-6">AI 股票趨勢分析排行榜</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {Object.entries(categories).map(([title, stocks]) => (
          <div key={title} className="bg-[#161b22] p-4 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">{title}趨勢</h2>
            {stocks.map((s, i) => (
              <div
                key={i}
                className="flex justify-between py-1 hover:underline cursor-pointer"
                onClick={() => openModal(s)}
              >
                <span className="text-blue-400">{s.股票}</span>
                <span>{s.建議買進機率 ?? "--"}%</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <Modal
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        width="90%"
        centered
        bodyStyle={{ background: "#0d1117" }}
      >
        {selected && (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">
              {selected.股票} 詳細分析
            </h2>

            {/* 趨勢說明 */}
            <div className="bg-[#161b22] p-4 rounded-xl mb-6">
              <h3 className="font-semibold mb-2 text-white">建議與趨勢</h3>
              <p className="text-white whitespace-pre-line">
                {selected.趨勢}，\n
                近30日漲跌幅：{selected.漲跌幅 ?? "--"}%\n
                成交量變化比：{selected.量能比 ?? "--"}\n
                建議買進機率：{selected.建議買進機率 ?? "--"}%\n
                建議賣出機率：{selected.建議賣出機率 ?? "--"}%
              </p>
            </div>

            {/* 股價圖表 */}
            {selected.線圖資料 && (
              <div className="bg-[#161b22] p-4 rounded-xl">
                <h3 className="font-semibold mb-2 text-white">股價線圖</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart
                    data={selected.線圖資料.日期.map((d, i) => ({
                      日期: d,
                      收盤價: selected.線圖資料.收盤價[i],
                      MA20: selected.線圖資料["20MA"][i],
                      MA60: selected.線圖資料["60MA"][i],
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="日期" stroke="white" />
                    <YAxis stroke="white" />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="收盤價"
                      stroke="skyblue"
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="MA20"
                      stroke="orange"
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="MA60"
                      stroke="lightgreen"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
