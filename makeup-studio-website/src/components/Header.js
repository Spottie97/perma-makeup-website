import React from 'react';
import { Link } from 'react-router-dom';
import CartIcon from './CartIcon';

function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/shop">Shop</Link></li>
          <li><Link to="/booking">Booking</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
        <div className="cart-icon-wrapper">
          <CartIcon />
        </div>
      </nav>
    </header>
  );
}

export default Header;
