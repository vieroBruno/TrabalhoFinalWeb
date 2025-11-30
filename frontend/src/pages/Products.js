import React, { useState, useEffect } from 'react';
import { fetchAPI } from '../api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Estado para controlar qual produto está sendo editado (null = criando novo)
  const [editingCode, setEditingCode] = useState(null);
  
  const [form, setForm] = useState({ name: '', amount: '', price: '', category_code: '' });

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    const data = await fetchAPI('apiProducts.php');
    setProducts(Array.isArray(data) ? data : []);
  };

  const loadCategories = async () => {
    const data = await fetchAPI('apiCategory.php');
    setCategories(Array.isArray(data) ? data : []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (editingCode) {
        await fetchAPI('apiProducts.php?shouldUpdate=1', 'PUT', { 
            ...form, 
            product_code: editingCode
        });
        alert("Produto atualizado com sucesso!");
        setEditingCode(null);
    } else {
        await fetchAPI('apiProducts.php', 'POST', form);
        alert("Produto cadastrado com sucesso!");
    }

    setForm({ name: '', amount: '', price: '', category_code: '' });
    loadProducts();
  };

  const handleDelete = async (code) => {
    if(!window.confirm("Excluir produto?")) return;
    await fetchAPI('apiProducts.php', 'DELETE', { code });
    loadProducts();
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
              <td style={{ display: 'flex', gap:'10px'}}>
                <button className="danger" onClick={() => handleDelete(p.code)}>Excluir</button>
                <button className="edit" onClick={() => handleUpdate(p.code)}>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}