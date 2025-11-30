import React, { useState, useEffect } from 'react';
import { fetchAPI } from '../api';
import { LiaTrashSolid, LiaEditSolid } from "react-icons/lia";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [historyItems, setHistoryItems] = useState([]);
  
  const [editingCode, setEditingCode] = useState(null);
  const [form, setForm] = useState({ name: '', amount: '', price: '', category_code: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const prodData = await fetchAPI('apiProducts.php');
    setProducts(Array.isArray(prodData) ? prodData : []);

    const catData = await fetchAPI('apiCategory.php');
    setCategories(Array.isArray(catData) ? catData : []);

    const histData = await fetchAPI('apiHistoryProducts.php');
    setHistoryItems(Array.isArray(histData) ? histData : []);
  };

  function validateString(string) {
    if (!string || string.trim() === "") {
      alert("Nome não pode ser vazio!");
      return 0;
    } else if (string.length > 100) {
      alert("Limite de caracteres (100) excedido!");
      return 0;
    }
    return 1;
  }

  function validateNumber(number) {
    if (number.length > 9) {
      alert("Valor máximo excedido!");
      return 0;
    } else if (number === "" || number < 0 || isNaN(number)) {
      alert("Valor inválido");
      return 0;
    }
    return 1;
  }

  function checkChar(e) {
    const char = String.fromCharCode(e.keyCode);
    const pattern = "[a-zA-Z0-9- ]";
    if (char.match(pattern) || e.keyCode === 8 || e.keyCode === 9) {
      return true;
    } else {
      e.preventDefault();
    }
  }

  function verifyProductByName(name) {
    const found = products.find(el => el.name.toLowerCase() === name.toLowerCase());
    return found ? found.code : 0;
  }

  function verifyHistory(code) {
    const inHistory = historyItems.some(h => h.code == code);
    if (inHistory) {
      alert("Erro ao excluir: produto existente no histórico de vendas!");
      return 1;
    }
    return 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateString(form.name)) return;
    if (!validateNumber(form.amount)) return;
    if (!validateNumber(form.price)) return;
    if (!form.category_code) { alert("Selecione uma categoria!"); return; }

    if (editingCode) {
        await fetchAPI('apiProducts.php?shouldUpdate=1', 'PUT', { 
            ...form, 
            product_code: editingCode
        });
        alert("Produto atualizado com sucesso!");
        setEditingCode(null);
    } else {
        const existingCode = verifyProductByName(form.name.trim());
        
        if (existingCode !== 0) {
            alert("Produto já cadastrado com esse nome!");
        } else {
            await fetchAPI('apiProducts.php', 'POST', form);
            alert("Produto cadastrado com sucesso!");
        }
    }

    setForm({ name: '', amount: '', price: '', category_code: '' });
    loadData();
  };

  const handleDelete = async (code) => {
    if(!window.confirm("Excluir produto?")) return;

    if (verifyHistory(code) === 1) return;

    await fetchAPI('apiProducts.php', 'DELETE', { code });
    alert("Produto deletado com sucesso!");
    loadData();
  };

  const handleUpdate = (code) => {
    const productToEdit = products.find(p => p.code === code);
    if (productToEdit) {
        setForm({
            name: productToEdit.name, 
            amount: productToEdit.amount, 
            price: productToEdit.price, 
            category_code: productToEdit.category_code || '' 
        });
        setEditingCode(code);
    }
  };

  const cancelEdit = () => {
      setEditingCode(null);
      setForm({ name: '', amount: '', price: '', category_code: '' });
  };

  return (
    <div className="container">
      <h2>Gerenciar Produtos</h2>
      <form onSubmit={handleSubmit} className="form-group">
        <input placeholder="Nome" 
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})} 
            onKeyDown={checkChar}
            required 
        />
        <input type="number" 
            placeholder="Qtd Estoque"
            value={form.amount} 
            onChange={e => setForm({...form, amount: e.target.value})} 
            required 
        />
        <input type="number"
            step="0.01" 
            placeholder="Preço"
            value={form.price}
            onChange={e => setForm({...form, price: e.target.value})} 
            required 
        />

        <select value={form.category_code} 
            onChange={e => setForm({...form, category_code: e.target.value})} 
            required
        >
          <option value="">Selecione Categoria</option>
              {categories.map(c => <option key={c.code} value={c.code}>{c.name}
            </option>)}
        </select>
        
        <button type="submit" className={editingCode ? "success" : ""}>
            {editingCode ? "Salvar Alterações" : "Cadastrar"}
        </button>
        
        {editingCode && (
            <button type="button" className="danger" onClick={cancelEdit} style={{marginLeft: '10px'}}>
                Cancelar
            </button>
        )}
      </form>

      <table>
        <thead>
          <tr>
            <th>Código</th><th>Produto</th><th>Estoque</th><th>Preço</th><th>Categoria</th><th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.code}>
              <td>{p.code}</td>
              <td>{p.name}</td>
              <td>{p.amount}</td>
              <td>R$ {p.price}</td>
              <td>{p.category_name}</td>
              <td className='actions-cell'>
                <button className="action-btn delete-btn" onClick={() => handleDelete(p.code)}>
                    <LiaTrashSolid size={24}/>
                </button>
                <button className="action-btn edit-btn" onClick={() => handleUpdate(p.code)}>
                    <LiaEditSolid size={24}/>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}