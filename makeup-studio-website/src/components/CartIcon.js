import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import CartContext from './CartContext';

function CartIcon() {
  const { cart } = useContext(CartContext);

  return (
    <Link to="/cart" className="cart-icon">
      🛒
      <span className="cart-count">{cart.length}</span>
    </Link>
  );
}

export default CartIcon;
