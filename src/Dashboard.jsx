import { useEffect, useState } from "react";
import { Modal } from "antd";

const API_URL = "/data/stock_analysis.json";  // ✅ 指向新的資料

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
              <th style={{ padding: "10px", border: "1px solid #30363d" }}>趨勢</th>
              <th style={{ padding: "10px", border: "1px solid #30363d" }}>均線交叉</th>
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
                <td style={{ padding: "10px", border: "1px solid #21262d" }}>{stock.趨勢}</td>
                <td style={{ padding: "10px", border: "1px solid #21262d" }}>{stock.均線交叉}</td>
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
        width="80%"
        centered
        bodyStyle={{ background: "#0d1117", color: "white" }}
      >
        {selectedStock && (
          <div style={{ padding: "10px" }}>
            <h2>{selectedStock.股票} 詳細資料</h2>
            <p>📈 最新收盤價：{selectedStock.最新收盤價}</p>
            <p>📊 趨勢分析：{selectedStock.趨勢}</p>
            <p>🔄 均線交叉情況：{selectedStock.均線交叉}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
