import React, { useState, useEffect } from 'react';
import { fetchAPI } from '../api';
import { PiEyeLight } from "react-icons/pi";

export default function History() {
  const [history, setHistory] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [modalData, setModalData] = useState([]);

  const formatCurrency = (value) => {
      return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
      }).format(parseFloat(value) || 0);
  };

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
    setModalData(Array.isArray(data) ? data : []);
    setSelectedSale(orderCode);
  };

  const { subtotal, taxTotal } = modalData.reduce((acc, item) => {
    acc.subtotal += parseFloat(item.total); 
    acc.taxTotal += parseFloat(item.tax);  
    return acc;
  }, { subtotal: 0, taxTotal: 0 });

  const finalTotal = subtotal + taxTotal;

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
                <td>{formatCurrency(h.tax)}</td>
                <td>{formatCurrency(h.total)}</td>
                <td className='actions-cell'>
                    <button className="action-btn view-btn" onClick={() => handleViewDetails(h.order_code)}>
                        <PiEyeLight size={24}/>
                    </button>
                </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedSale && (
        <div className="modal-overlay" onClick={() => setSelectedSale(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Detalhes da Venda #{selectedSale}</h3>
            {modalData.length > 0 && <p>Data: {modalData[0].date_order}</p>}
            
            <div style={{maxHeight: '300px', overflowY: 'auto'}}>
                <table>
                <thead>
                    <tr><th>Item</th>
                        <th>Produto</th>
                        <th>Total</th>
                        <th>Imposto</th></tr>
                </thead>
                <tbody>
                    {modalData.map((item, idx) => (
                    <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{item.p_name}</td>
                        <td>{formatCurrency(item.total)}</td>
                        <td>{formatCurrency(item.tax)}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>

            <div className="order-summary">
                <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="summary-row">
                    <span>Imposto:</span>
                    <span>{formatCurrency(taxTotal)}</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total">
                    <span>Total:</span>
                    <span>{formatCurrency(finalTotal)}</span>
                </div>
            </div>

            <button className="danger" onClick={() => setSelectedSale(null)} style={{marginTop:'15px', width: '25%'}}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}