import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";
import { Modal } from "antd";

const API_URL = "/data/stock_analysis.json";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedStock, setSelectedStock] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(json => {
        setData(json);
        setFilteredData(json);
      });
  }, []);

  const handleSearch = (e) => {
    const keyword = e.target.value.toUpperCase();
    setSearch(keyword);
    const filtered = data.filter(stock => stock.股票.toUpperCase().includes(keyword));
    setFilteredData(filtered);
  };

  const openModal = (stock) => {
    setSelectedStock(stock);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStock(null);
  };

  return (
    <div style={{ padding: "10px" }}>
      <input
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="🔎 搜尋股票代碼..."
        style={{
          padding: "10px",
          marginBottom: "20px",
          width: "300px",
          fontSize: "16px",
          borderRadius: "8px",
          border: "1px solid #555",
          backgroundColor: "#161b22",
          color: "white"
        }}
      />

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#161b22", color: "white" }}>
              <th style={{ padding: "10px", border: "1px solid #30363d" }}>股票代碼</th>
              <th style={{ padding: "10px", border: "1px solid #30363d" }}>最新收盤價</th>
              <th style={{ padding: "10px", border: "1px solid #30363d" }}>價格趨勢</th>
              <th style={{ padding: "10px", border: "1px solid #30363d" }}>成交量趨勢</th>
              <th style={{ padding: "10px", border: "1px solid #30363d" }}>綜合建議</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((stock, idx) => (
              <tr
                key={idx}
                onClick={() => openModal(stock)}
                style={{ cursor: "pointer", background: idx % 2 === 0 ? "#0d1117" : "#161b22", color: "white" }}
              >
                <td style={{ padding: "10px", border: "1px solid #21262d" }}>{stock.股票}</td>
                <td style={{ padding: "10px", border: "1px solid #21262d" }}>{stock.最新收盤價}</td>
                <td style={{ padding: "10px", border: "1px solid #21262d" }}>{stock.價格趨勢}</td>
                <td style={{ padding: "10px", border: "1px solid #21262d" }}>{stock.成交量趨勢}</td>
                <td style={{ padding: "10px", border: "1px solid #21262d" }}>{stock.綜合建議}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal彈窗 */}
      <Modal
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        width="90%"
        centered
        bodyStyle={{ background: "#0d1117" }}
      >
        {selectedStock && (
          <div style={{ padding: "10px" }}>
            <h2 style={{ color: "white" }}>{selectedStock.股票} 股價走勢圖</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={selectedStock.線圖資料.日期.map((date, idx) => ({
                  日期: date,
                  收盤價: selectedStock.線圖資料.收盤價[idx],
                  二十日均線: selectedStock.線圖資料["20MA"][idx],
                  六十日均線: selectedStock.線圖資料["60MA"][idx],
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="日期" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="收盤價" stroke="skyblue" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="二十日均線" stroke="orange" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="六十日均線" stroke="lightgreen" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Modal>
    </div>
  );
}
