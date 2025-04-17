import React from 'react';
import Navbar from './components/Navbar';
import ProductGrid from './src/components/ProductGrid';
import './App.css';

function App() {
  return (
    React.createElement(
      React.Fragment,
      null,
      React.createElement(Navbar),
      React.createElement(ProductGrid)
    )
  );
}

export default App;
