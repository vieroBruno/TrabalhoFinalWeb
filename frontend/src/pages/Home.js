import React, { useState, useEffect } from 'react';
import { fetchAPI } from '../api';

export default function Home() {
  const [availableProducts, setAvailableProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [totals, setTotals] = useState({ tax: 0, total: 0, orderCode: null });

  useEffect(() => {
    loadAvailableProducts();
    loadCart();
  }, []);

  const loadAvailableProducts = async () => {
    const data = await fetchAPI('apiProductsAvailable.php');
    setAvailableProducts(Array.isArray(data) ? data : []);
  };

  const loadCart = async () => {
    const data = await fetchAPI('apiProductsStore.php');
    if (Array.isArray(data) && data.length > 0) {
      setCartItems(data);
      setTotals({
        tax: data[0].tax_total,
        total: data[0].total,
        orderCode: data[0].order_code 
      });
    } else {
      setCartItems([]);
      setTotals({ tax: 0, total: 0, orderCode: null });
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    const product = availableProducts.find(p => p.code === selectedProduct);
    if (!product) return;

    const payload = {
      order_code: totals.orderCode || 0,
      product_code: product.code,
      amount: quantity,
      price: product.price,
      tax: product.tax
    };

    await fetchAPI('apiStore.php', 'POST', payload);
    
    await fetchAPI('apiProductsAvailable.php', 'PUT', { product_code: product.code, amount: quantity });

    setSelectedProduct('');
    setQuantity(1);
    loadCart();
    loadAvailableProducts();
  };

  const handleRemoveItem = async (item) => {
    await fetchAPI('apiProductsStore.php', 'DELETE', { 
      code: item.code, 
      total_row: item.total_row, 
      tax_row: item.tax_row 
    });
    loadCart();
  };

  const handleFinishOrder = async () => {
    const openOrder = await fetchAPI('apiStore.php');
    if (openOrder && openOrder[0]) {
       await fetchAPI('apiProductsStore.php', 'PUT', { order_code: openOrder[0].code });
       alert("Venda Finalizada com Sucesso!");
       loadCart();
    }
  };

  return (
    <div className="container">
      <h2>Ponto de Venda</h2>
      
      <form onSubmit={handleAddToCart} className="form-group">
        <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} required>
          <option value="">Selecione um Produto</option>
          {availableProducts.map(p => (
            <option key={p.code} value={p.code}>
              {p.name} (R$ {p.price}) - Est: {p.amount}
            </option>
          ))}
        </select>
        <input 
          type="number" min="1" 
          value={quantity} onChange={e => setQuantity(e.target.value)} 
          style={{flex: '0 0 100px'}}
        />
        <button type="submit" className="success">Adicionar</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Produto</th><th>Qtd</th><th>Unitário</th><th>Imposto (Item)</th><th>Subtotal</th><th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map(item => (
            <tr key={item.code}>
              <td>{item.name}</td>
              <td>{item.amount}</td>
              <td>R$ {item.price}</td>
              <td>R$ {item.tax_row}</td>
              <td>R$ {item.total_row}</td>
              <td><button className="danger" onClick={() => handleRemoveItem(item)}>Remover</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="totals">
        <span>Imposto Total: R$ {parseFloat(totals.tax).toFixed(2)}</span>
        <span className="final-total">Total Venda: R$ {parseFloat(totals.total).toFixed(2)}</span>
        <div style={{marginTop: '20px'}}>
           <button className="success" onClick={handleFinishOrder} disabled={cartItems.length === 0}>
             Finalizar Venda
           </button>
        </div>
      </div>
    </div>
  );
}