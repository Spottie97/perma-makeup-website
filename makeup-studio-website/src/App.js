import React from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import Services from './components/Services';
import Booking from './components/Booking';
import Contact from './components/Contact';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <div className="background-animation">
          <svg width="100%" height="100%" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#1c1c1c" />
            <circle cx="200" cy="200" r="100" fill="#ff4d4d">
              <animate attributeName="cx" values="200;600;200" dur="10s" repeatCount="indefinite" />
              <animate attributeName="cy" values="200;100;200" dur="10s" repeatCount="indefinite" />
            </circle>
            <circle cx="600" cy="100" r="50" fill="#b30000">
              <animate attributeName="cx" values="600;200;600" dur="10s" repeatCount="indefinite" />
              <animate attributeName="cy" values="100;300;100" dur="10s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
