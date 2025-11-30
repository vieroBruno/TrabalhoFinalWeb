import React, { useState, useEffect } from 'react';
import { fetchAPI } from '../api';

export default function History() {
  const [history, setHistory] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [modalData, setModalData] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      const data = await fetchAPI('apiHistory.php');
      setHistory(Array.isArray(data) ? data : []);
    };
    loadHistory();
  }, []);

  const handleViewDetails = async (orderCode) => {
    const response = await fetch(`${require('../api').API_BASE}/apiModalHistory.php?index=${orderCode}`);
    const data = await response.json();
    setModalData(data);
    setSelectedSale(orderCode);
  };

  return (
    <div className="container">
      <h2>Histórico de Vendas</h2>
      <table>
        <thead>
          <tr><th>Código Venda</th><th>Imposto Total</th><th>Valor Total</th><th>Detalhes</th></tr>
        </thead>
        <tbody>
          {history.map(h => (
            <tr key={h.order_code}>
              <td>{h.order_code}</td>
              <td>R$ {h.tax}</td>
              <td>R$ {h.total}</td>
              <td><button onClick={() => handleViewDetails(h.order_code)}>View</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedSale && (
        <div className="modal-overlay" onClick={() => setSelectedSale(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Detalhes da Venda #{selectedSale}</h3>
            {modalData.length > 0 && <p>Data: {modalData[0].date_order}</p>}
            <table>
              <thead>
                <tr><th>Item</th><th>Produto</th><th>Total Item</th><th>Imposto Item</th></tr>
              </thead>
              <tbody>
                {modalData.map((item, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{item.p_name}</td>
                    <td>R$ {item.total}</td>
                    <td>R$ {item.tax}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="danger" onClick={() => setSelectedSale(null)} style={{marginTop:'15px'}}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}