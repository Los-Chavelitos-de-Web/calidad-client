import React from 'react';
import './Navbar.css';

function Navbar() {
  return (
    React.createElement(
      'nav',
      { className: 'navbar' },
      React.createElement('button', { className: 'menu-button' }, '☰'),
      React.createElement('div', { className: 'logo' }, 'AIRCLOCK'),
      React.createElement('input', { className: 'search-bar', type: 'text', placeholder: 'Buscar...' }),
      React.createElement('div', { className: 'cart' }, '🛒')
    )
  );
}

export default Navbar;
