import React, { useState, useEffect } from 'react';
import { fetchAPI } from '../api';
import { LiaTrashSolid, LiaEditSolid } from "react-icons/lia";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  
  const [editingCode, setEditingCode] = useState(null);
  const [form, setForm] = useState({ name: '', tax: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const cats = await fetchAPI('apiCategory.php');
    setCategories(Array.isArray(cats) ? cats : []);
    
    const prods = await fetchAPI('apiProducts.php');
    setProducts(Array.isArray(prods) ? prods : []);
  };

  function validateString(string) {
    let limit = 30;
    if (!string || string.trim() === "") {
      alert("Categoria não pode ser vazia!");
      return 0;
    } else if (string.length > limit) {
      alert("Limite de caracteres para a categoria excedido!");
      return 0;
    }
    return 1;
  }

  function validateNumber(number) {
    if (number > 100) {
      alert("Taxa máxima : 100%");
      return 0;
    } else if (number === "" || number < 0 || isNaN(number)) {
      alert("Valor inválido!");
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

  function verifyCategory(name) {

    const exists = categories.some((el) => el.name.toLowerCase() === name.toLowerCase() && el.code !== editingCode);
    if (exists) {
      alert("Categoria já cadastrada");
      return 1;
    }
    return 0;
  }

  function verifyCategoryProducts(code) {
    const inUse = products.some((el) => el.category_code === code);
    return inUse ? 1 : 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateString(form.name) === 0) return;
    if (validateNumber(form.tax) === 0) return;
    if (verifyCategory(form.name.trim()) === 1) return;

    if (editingCode) {
        await fetchAPI('apiCategory.php', 'PUT', { 
            code: editingCode,
            name: form.name,
            tax: form.tax
        });
        alert("Categoria atualizada com sucesso!");
        setEditingCode(null);
    } else {
        await fetchAPI('apiCategory.php', 'POST', form);
        alert("Categoria cadastrada com sucesso!");
    }

    setForm({ name: '', tax: '' });
    loadData();
  };

  const handleUpdate = (cat) => {
      setForm({ name: cat.name, tax: cat.tax });
      setEditingCode(cat.code);
  };

  const cancelEdit = () => {
      setEditingCode(null);
      setForm({ name: '', tax: '' });
  };

  const handleDelete = async (code) => {
    if (!window.confirm("Deseja deletar essa categoria?")) return;

    if (verifyCategoryProducts(code) === 1) {
      alert("Não foi possível excluir pois existe um produto cadastrado com essa categoria!");
      return;
    }

    await fetchAPI('apiCategory.php', 'DELETE', { code });
    alert("Categoria deletada com sucesso!");
    loadData();
  };

  return (
    <div className="container">
      <h2>Gerenciar Categorias</h2>
      <form onSubmit={handleSubmit} className="form-group">
        <input 
          placeholder="Nome da Categoria" 
          value={form.name} 
          onChange={e => setForm({...form, name: e.target.value})} 
          onKeyDown={checkChar}
          required 
        />
        <input 
          type="number" step="0.01" placeholder="Imposto (%)" 
          value={form.tax} 
          onChange={e => setForm({...form, tax: e.target.value})} 
          required 
        />
        
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
            <th>Código</th><th>Nome</th><th>Imposto (%)</th><th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.code}>
              <td>{cat.code}</td>
              <td>{cat.name}</td>
              <td>{cat.tax}</td>
              <td className="actions-cell">
                <button className="action-btn edit-btn" title="Editar" onClick={() => handleUpdate(cat)}>
                    <LiaEditSolid size={24} />
                </button>
                <button className="action-btn delete-btn" title="Excluir" onClick={() => handleDelete(cat.code)}>
                    <LiaTrashSolid size={24} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}