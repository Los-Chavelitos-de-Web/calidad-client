import React, { useState } from 'react';
import { usePayload } from "../../utils/authHelpers";
import './admin-css/ProductsDetaills.css';

const ProductDetailsModal = ({ product, onClose }) => {
  const [isActive, setIsActive] = useState(product?.isActive || false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { authToken } = usePayload();

  const getStock = (stockData) => {
    if (!stockData) return 0;
    return Object.values(stockData).reduce((sum, val) => sum + (val || 0), 0);
  };

  const formatSpecKey = (key) => {
    const words = key.replace(/([A-Z])/g, ' $1');
    return words.charAt(0).toUpperCase() + words.slice(1);
  };

  const renderSpecValue = (value) => {
    if (Array.isArray(value)) {
      return (
        <ul>
          {value.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      );
    }
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    return value.toString();
  };

  const handleToggleStatus = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACK}/products/status/${product.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({ isActive: !isActive }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el estado');
      }

      await response.json();
      setIsActive(!isActive);
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      setError(error.message || 'No se pudo actualizar el estado. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <h2>Detalles del Producto</h2>
        {product && (
          <div className="product-details">
            <div className="basic-info">
              <p><strong>Nombre:</strong> {product.title}</p>
              <p><strong>Marca:</strong> {product.brand}</p>
              <p><strong>Modelo:</strong> {product.model}</p>
              <p><strong>Categoría:</strong> {product.category}</p>
              <p><strong>Precio:</strong> S/ {product.price}</p>
              <p><strong>Descripción:</strong> {product.description}</p>
              <p><strong>Manual URL:</strong> <a href={product.manualUrl} target="_blank" rel="noopener noreferrer">{product.manualUrl}</a></p>
              <p><strong>Stock total:</strong> {getStock(product.stock)}</p>
              <p><strong>Estado:</strong> {isActive ? 'Activo' : 'Inactivo'}</p>
            </div>
            <div className="specs-section">
              <h4>Especificaciones Técnicas</h4>
              {product.specs ? (
                <table className="specs-table">
                  <tbody>
                    {Object.entries(product.specs).map(([key, value]) => (
                      <tr key={key}>
                        <td className="spec-key"><strong>{formatSpecKey(key)}</strong></td>
                        <td className="spec-value">{renderSpecValue(value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No hay especificaciones disponibles</p>
              )}
            </div>
            <button 
              onClick={handleToggleStatus}
              disabled={isLoading}
              className={`status-btn ${isActive ? 'active' : 'inactive'}`}
            >
              {isLoading ? 'Cargando...' : (isActive ? 'Desactivar' : 'Activar')}
            </button>
            {error && <p className="error-message">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsModal;
