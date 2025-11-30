import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom"
import Home from "./pages/Home"
import Categories from "./pages/Categories"
import Products from "./pages/Products"
import History from "./pages/History"
import "./App.css"

function App() {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <div className="App">
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <span className="logo-text">Ponto de venda</span>
          </div>
          <div className="navbar-links">
            <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
              <span className="nav-label">Home</span>
            </Link>
            <Link to="/products" className={`nav-link ${isActive("/products") ? "active" : ""}`}>
              <span className="nav-label">Produtos</span>
            </Link>
            <Link to="/categories" className={`nav-link ${isActive("/categories") ? "active" : ""}`}>
              <span className="nav-label">Categorias</span>
            </Link>
            <Link to="/history" className={`nav-link ${isActive("/history") ? "active" : ""}`}>
              <span className="nav-label">Histórico</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </div>
  )
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  )
}

export default AppWrapper
