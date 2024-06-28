import React from 'react';

const products = [
  {
    id: 1,
    name: 'Product 1',
    description: 'Description of product 1.',
    price: '$20.00',
    image: '/path-to-product1-image.jpg',
  },
  {
    id: 2,
    name: 'Product 2',
    description: 'Description of product 2.',
    price: '$30.00',
    image: '/path-to-product2-image.jpg',
  },
  {
    id: 3,
    name: 'Product 3',
    description: 'Description of product 3.',
    price: '$40.00',
    image: '/path-to-product3-image.jpg',
  },
  // Add more products as needed
];

function Shop() {
  return (
    <div className="section section-light">
      <h1>Shop</h1>
      <div className="shop-grid">
        {products.map(product => (
          <div key={product.id} className="card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>{product.price}</p>
            <button>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Shop;
