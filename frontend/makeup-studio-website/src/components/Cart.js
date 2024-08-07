import React, { useContext } from 'react';
import CartContext from './CartContext';

function Cart() {
  const { cart, dispatch, isLoading } = useContext(CartContext);

  const removeFromCart = (item) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: item });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="section section-light">
      <h1>Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                <img src={item.image} alt={item.name} />
                <h3>{item.name}</h3>
                <p>{item.price}</p>
                <button onClick={() => removeFromCart(item)}>Remove</button>
              </li>
            ))}
          </ul>
          <button onClick={clearCart}>Clear Cart</button>
        </div>
      )}
    </div>
  );
}

export default Cart;