import { BrowserRouter, Link, Route, Routes } from 'react-router';
import Home from './components/pages/Home';
import Categories from './components/pages/Categories';
import Products from './components/pages/Products';
import Histories from './components/pages/Histories';

import Container from './components/layouts/Container';
import NavBar from './components/layouts/NavBar'
import Footer from './components/layouts/Footer';

export default function App() {
  
  return (
    <BrowserRouter>
      <NavBar/>
        <Container customClass='min-height'> 
          <Routes>
            <Route exact path='/' element={<Home />}></Route>
            <Route path='/categories' element={<Categories />}></Route>
            <Route path='/products' element={<Products />}></Route>
            <Route path='/histories' element={<Histories />}></Route>
          </Routes>
        </Container>
    </BrowserRouter>
  )
}

