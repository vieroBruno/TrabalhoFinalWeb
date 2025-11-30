import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Categories from './pages/Categories';
import Products from './pages/Products';
import History from './pages/History';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <Link to="/">PDV / Vendas</Link>
          <Link to="/products">Produtos</Link>
          <Link to="/categories">Categorias</Link>
          <Link to="/history">Histórico</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;