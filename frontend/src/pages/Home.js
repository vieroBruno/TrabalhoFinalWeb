import React, { useState, useEffect } from 'react';
import { fetchAPI } from '../api';
import { LiaTrashSolid } from "react-icons/lia";

export default function Home() {
  const [availableProducts, setAvailableProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [totals, setTotals] = useState({ tax: 0, total: 0, orderCode: null });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const products = await fetchAPI('apiProductsAvailable.php');
    setAvailableProducts(Array.isArray(products) ? products : []);
    
    await loadCart();
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

  function validateNumber(number) {
    if (number > 1000000) { // Limite arbitrário de segurança
        alert("Valor máximo excedido!");
        return 0;
    } else if (number === "" || number < 0 || isNaN(number) || number == 0) {
        alert("Quantidade inválida");
        return 0;
    }
    return 1;
  }

  function verifyStock(code, requestedAmount) {
    const product = availableProducts.find(p => p.code == code);
    if (product) {
        const stock = parseFloat(product.amount);
        if (stock < requestedAmount) {
            alert("Quantidade não disponível no estoque! \nDisponível: " + stock);
            return 0; // Inválido
        }
        return 1; // Válido
    }
    return 0;
  }

  function verifyStore(productCode) {
    const existingItem = cartItems.find(item => item.product_code == productCode);
    return existingItem ? existingItem.code : 0;
  }
  // ------------------

  const handleAddToCart = async (e) => {
    e.preventDefault();
    
    if (!validateNumber(quantity)) return;
    if (!selectedProduct) { alert("Selecione um produto!"); return; }
    if (verifyStock(selectedProduct, quantity) === 0) return;

    const product = availableProducts.find(p => p.code == selectedProduct);
    
    // Verifica se já existe no carrinho
    const itemInCart = verifyStore(product.code);

    const payload = {
      order_code: totals.orderCode || 0,
      product_code: product.code,
      amount: quantity,
      price: product.price,
      tax: product.tax
    };

    if (itemInCart !== 0) {
        await fetchAPI('apiStore.php', 'PUT', payload);
        
        await fetchAPI('apiSumOrder.php', 'PUT', payload);
        
        alert("Produto já existente, quantia adicionada com sucesso!");
    } else {
        await fetchAPI('apiStore.php', 'POST', payload);
        alert("Produto adicionado com sucesso!");
    }
    
    await fetchAPI('apiProductsAvailable.php', 'PUT', { product_code: product.code, amount: quantity });

    setSelectedProduct('');
    setQuantity(1);
    loadData(); 
  };

  const handleRemoveItem = async (item) => {
    if(!window.confirm("Deseja remover este item?")) return;

    await fetchAPI('apiProductsStore.php', 'DELETE', { 
      code: item.code, 
      total_row: item.total_row, 
      tax_row: item.tax_row 
    });
    
    await fetchAPI('apiProducts.php?shouldUpdateAmount=1', 'PUT', {
        product_code: item.product_code,
        amount: item.amount
    });

    loadData();
  };

  const handleFinishOrder = async () => {
    if (cartItems.length === 0) {
        alert("Nenhum produto no carrinho!");
        return;
    }
    
    const openOrder = await fetchAPI('apiStore.php');
    if (openOrder && openOrder[0]) {
       await fetchAPI('apiProductsStore.php', 'PUT', { order_code: openOrder[0].code });
       alert("Compra efetuada com sucesso!");
       loadData();
    }
  };

  const handleCancelOrder = async () => {
      if(!window.confirm("Você tem certeza que deseja cancelar a compra?")) return;
      if(cartItems.length === 0) { alert("Carrinho vazio"); return; }

      for(let item of cartItems) {
          await fetchAPI('apiProducts.php?shouldUpdateAmount=1', 'PUT', {
              product_code: item.product_code,
              amount: item.amount
          });
      }

      if (totals.orderCode) {
          await fetchAPI('apiDeleteStore.php', 'DELETE', { order_code: totals.orderCode });
      }
      
      alert("Compra cancelada!");
      loadData();
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
            <th>Produto</th><th>Qtd</th><th>Unitário</th><th>Imposto</th><th>Subtotal</th><th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map(item => (
            <tr key={item.code}>
                <td>{item.name}</td>
                <td>{item.amount}</td>
                <td>R$ {item.price}</td>
                <td>R$ {parseFloat(item.tax_row)}</td>
                <td>R$ {item.total_row}</td>
                <td>
                    <button className="action-btn delete-btn" onClick={() => handleRemoveItem(item)}>
                        <LiaTrashSolid size={24}/>
                    </button>
                </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="totals">
        <span>Imposto Total: R$ {parseFloat(totals.tax).toFixed(2)}</span>
        <span className="final-total">Total Venda: R$ {parseFloat(totals.total).toFixed(2)}</span>
        <div style={{marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end'}}>
           <button className="danger" onClick={handleCancelOrder} disabled={cartItems.length === 0}>
             Cancelar
           </button>
           <button className="success" onClick={handleFinishOrder} disabled={cartItems.length === 0}>
             Finalizar Venda
           </button>
        </div>
      </div>
    </div>
  );
}