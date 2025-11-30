import React, { useState, useEffect } from 'react';
import { fetchAPI } from '../api';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', tax: '' });

  useEffect(() => { loadCategories(); }, []);

  const loadCategories = async () => {
    const data = await fetchAPI('apiCategory.php');
    setCategories(Array.isArray(data) ? data : []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetchAPI('apiCategory.php', 'POST', form);
    setForm({ name: '', tax: '' });
    loadCategories();
  };

  const handleDelete = async (code) => {
    if(!window.confirm("Deseja excluir?")) return;
    await fetchAPI('apiCategory.php', 'DELETE', { code });
    loadCategories();
  };

  return (
    <div className="container">
      <h2>Gerenciar Categorias</h2>
      <form onSubmit={handleSubmit} className="form-group">
        <input 
          placeholder="Nome da Categoria" 
          value={form.name} 
          onChange={e => setForm({...form, name: e.target.value})} 
          required 
        />
        <input 
          type="number" step="0.01" placeholder="Imposto (%)" 
          value={form.tax} 
          onChange={e => setForm({...form, tax: e.target.value})} 
          required 
        />
        <button type="submit">Cadastrar</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Código</th><th>Nome</th><th>Imposto (%)</th><th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.code}>
              <td>{cat.code}</td>
              <td>{cat.name}</td>
              <td>{cat.tax}</td>
              <td>
                <button className="danger" onClick={() => handleDelete(cat.code)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}