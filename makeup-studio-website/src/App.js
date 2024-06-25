import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import Services from './components/Services';
import Booking from './components/Booking';
import Contact from './components/Contact';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <div className="background-animation">
          <svg className="background-svg" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#ff4d4d', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#b30000', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <circle cx="50%" cy="50%" r="45%" fill="url(#grad1)">
              <animate attributeName="r" values="45%;50%;45%" dur="10s" repeatCount="indefinite" />
              <animate attributeName="cx" values="50%;55%;50%" dur="10s" repeatCount="indefinite" />
              <animate attributeName="cy" values="50%;45%;50%" dur="10s" repeatCount="indefinite" />
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
