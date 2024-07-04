import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CartProvider } from './components/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import Services from './components/Services';
import Booking from './components/Booking';
import Contact from './components/Contact';
import Shop from './components/Shop';
import Cart from './components/Cart';
import Brows from './components/service-pages/brows';
import Lips from './components/service-pages/lips';
import Eyeliner from './components/service-pages/eyeliner';
import './App.css';

function App() {
  return (
    <CartProvider>
      <div className="App">
        <Router>
          <Header />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/brows" element={<Brows />} />
              <Route path="/lips" element={<Lips />} />
              <Route path="/eyeliner" element={<Eyeliner />} />
            </Routes>
          </div>
          <Footer />
        </Router>
      </div>
    </CartProvider>
  );
}

export default App;
