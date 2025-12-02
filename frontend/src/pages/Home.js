import React, { useState, useEffect } from 'react';
import { fetchAPI } from '../api';
import { LiaTrashSolid, LiaEditSolid } from "react-icons/lia";

export default function Home() {
  const [availableProducts, setAvailableProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(null);
  
  const [editingProductCode, setEditingProductCode] = useState(null);
  const [originalQuantity, setOriginalQuantity] = useState(null);

  const [totals, setTotals] = useState({ tax: 0, total: 0, orderCode: null });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const products = await fetchAPI('apiProductsAvailable.php');
    setAvailableProducts(Array.isArray(products) ? products : []);
    await loadCart();
  };

  const formatCurrency = (value) => {
      return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
      }).format(parseFloat(value) || 0);
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
    if (number > 1000000) { 
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
        let stockCheckAmount = requestedAmount; 
        
        const stock = parseFloat(product.amount);
        
        if (stock < stockCheckAmount) {
            alert("Quantidade não disponível no estoque! \nDisponível: " + stock);
            return 0;
        }
        return 1;
    }
    return 0;
  }

  function verifyStore(productCode) {
    const existingItem = cartItems.find(item => item.product_code == productCode);
    return existingItem ? existingItem.code : 0;
  }

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!validateNumber(quantity)) return;
    if (!selectedProduct) { alert("Selecione um produto!"); return; }

    let product = availableProducts.find(p => p.code == selectedProduct);
    
    if (!product) {
        const cartItem = cartItems.find(item => item.product_code == selectedProduct);
        if (cartItem) {
            product = {
                code: cartItem.product_code,
                name: cartItem.name,
                price: cartItem.price,
                tax: cartItem.tax,
                amount: 0
            };
        }
    }

    
    if (editingProductCode) {
        const diff = parseFloat(quantity) - parseFloat(originalQuantity);
        
        if (diff === 0) { cancelEdit(); return; } 
        if (diff > 0) { 
            if (verifyStock(selectedProduct, diff) === 0) return; 
        }

        const payload = {
            order_code: totals.orderCode,
            product_code: product.code,
            amount: diff,
            price: product.price,
            tax: product.tax
        };

        await fetchAPI('apiStore.php', 'PUT', payload);
        await fetchAPI('apiSumOrder.php', 'PUT', payload);
        await fetchAPI('apiProductsAvailable.php', 'PUT', { product_code: product.code, amount: diff });

        alert("Quantidade atualizada!");
        cancelEdit();

    } else {
        if (verifyStock(selectedProduct, quantity) === 0) return;

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
        } else {
            await fetchAPI('apiStore.php', 'POST', payload);
        }
        await fetchAPI('apiProductsAvailable.php', 'PUT', { product_code: product.code, amount: quantity });
        
        setSelectedProduct('');
        setQuantity(1);
    }
    loadData();
  };

  const handleUpdate = (item) => {
      setSelectedProduct(item.product_code);
      setQuantity(item.amount);
      setEditingProductCode(item.product_code);
      setOriginalQuantity(item.amount);
  };

  const cancelEdit = () => {
      setEditingProductCode(null);
      setOriginalQuantity(null);
      setSelectedProduct('');
      setQuantity('');
  };

  const handleRemoveItem = async (item) => {
    if(!window.confirm("Deseja remover este item?")) return;

    if (editingProductCode === item.product_code) cancelEdit();

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
      <h2>Selecione um produto</h2>
      
      <form onSubmit={handleAddToCart} className="form-group">
        <select 
            value={selectedProduct} 
            onChange={e => setSelectedProduct(e.target.value)} 
            required
            disabled={!!editingProductCode} 
            style={{backgroundColor: editingProductCode ? '#e9ecef' : 'white'}}
        >
          <option value="">Selecione um Produto</option>
          {availableProducts.map(p => (
            <option key={p.code} value={p.code}>
              {p.name} ({formatCurrency(p.price)}) - Est: {p.amount}
            </option>
          ))}

          {editingProductCode && !availableProducts.find(p => p.code == editingProductCode) && (
                <option value={editingProductCode}>
                    {cartItems.find(item => item.product_code == editingProductCode)?.name} (Indisponível no Estoque)
                </option>
            )}
        </select>
        
        <input 
          type="number"
          value={quantity} onChange={e => setQuantity(e.target.value)} 
          style={{flex: '0 0 100px'}}
          placeholder='Quantidade'
        />
        
        <button type="submit" className={editingProductCode ? "success" : "success"}>
            {editingProductCode ? "Salvar Alteração" : "Adicionar"}
        </button>
        
        {editingProductCode && (
            <button type="button" className="danger" onClick={cancelEdit} style={{marginLeft:'10px'}}>Cancelar</button>
        )}
      </form>

      <h2>Carrinho</h2>

      <table>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Quantidade</th>
            <th>Unitário</th>
            <th>Subtotal</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map(item => (
            <tr key={item.code}>
              <td>{item.name}</td>
              <td>{item.amount}</td>
              <td>{formatCurrency(item.price)}</td>
              <td>{formatCurrency(item.total_row)}</td>
              <td className="actions-cell">
                <button className="action-btn edit-btn" title="Editar Quantidade" onClick={() => handleUpdate(item)}>
                    <LiaEditSolid size={24} />
                </button>
                <button className="action-btn delete-btn" title="Remover" onClick={() => handleRemoveItem(item)}>
                    <LiaTrashSolid size={24} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="totals">
        <span className="final-total">Total Venda: R$ {formatCurrency(totals.total)}</span>
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