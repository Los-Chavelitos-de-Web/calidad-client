import React from 'react';
import './Products.css';

function ProductGrid() {
  const products = Array(10).fill({
    title: 'RELOJ TIMEKEY 1115 ORIGINAL - DORADO Y PLATEADO | TIM-1, TIM-2',
    price: 'S/. 118.99',
    image: 'https://via.placeholder.com/150'
  });

  return (
    React.createElement(
      'div',
      { className: 'product-section' },
      React.createElement('h3', null, 'LOS MÁS VENDIDOS'),
      React.createElement(
        'div',
        { className: 'product-grid' },
        products.map((p, i) =>
          React.createElement(
            'div',
            { className: 'product-card', key: i },
            React.createElement('img', { src: p.image, alt: 'watch' }),
            React.createElement('p', { className: 'product-title' }, p.title),
            React.createElement('p', { className: 'product-price' }, p.price),
            React.createElement('button', { className: 'product-button' }, 'ESCOGER OPCIÓN')
          )
        )
      )
    )
  );
}

export default ProductGrid;
