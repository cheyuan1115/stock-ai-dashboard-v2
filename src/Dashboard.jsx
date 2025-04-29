import { useEffect, useState } from "react";
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
    <div style={{ padding: "20px", backgroundColor: "#0d1117", minHeight: "100vh", color: "white" }}>
      <h1>📈 股票趨勢分析系統</h1>

      <input
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="🔎 搜尋股票代碼..."
        style={{
          padding: "10px",
          margin: "20px 0",
          width: "300px",
          fontSize: "16px",
          borderRadius: "8px",
          border: "1px solid #555",
          backgroundColor: "#161b22",
          color: "white"
        }}
      />

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#161b22" }}>
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
              style={{
                cursor: "pointer",
                background: idx % 2 === 0 ? "#0d1117" : "#161b22"
              }}
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

      <Modal
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        width="90%"
        centered
        bodyStyle={{ background: "#0d1117" }}
      >
        {selectedStock && (
          <div style={{ textAlign: "center" }}>
            <h2>{selectedStock.股票} 詳細分析</h2>
            <img
              src={`/charts/${selectedStock.股票}.png`}
              alt={`${selectedStock.股票} 線圖`}
              style={{ width: "90%", maxHeight: "500px", marginBottom: "20px" }}
            />
            <div style={{ textAlign: "left", fontSize: "18px" }}>
              <p><b>價格趨勢：</b>{selectedStock.價格趨勢}</p>
              <p><b>成交量趨勢：</b>{selectedStock.成交量趨勢}</p>
              <p><b>綜合建議：</b>{selectedStock.綜合建議}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
