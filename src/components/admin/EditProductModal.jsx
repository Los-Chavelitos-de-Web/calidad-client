import React, { useState } from 'react';
import { usePayload } from "../../utils/authHelpers";
import './admin-css/edit-modal.css';

const EditProductModal = ({ product, onClose, onProductUpdated }) => {
  const [formData, setFormData] = useState({
    title: product.title || '',
    brand: product.brand || '',
    model: product.model || '',
    category: product.category || '',
    price: product.price || 0,
    description: product.description || '',
    manufacturer: product.manufacturer || '',
    manualUrl: product.manualUrl || ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { authToken } = usePayload() || {};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value
    }));
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACK}/products/update/${product.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify(formData)
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Error al actualizar producto');
      }

      const updated = await response.json();
      onProductUpdated(updated);
    } catch (err) {
      setError(err.message || 'Error al actualizar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <h2>Editar Producto</h2>

        <div className="edit-form">
          <label>Título:
            <input type="text" name="title" value={formData.title} onChange={handleChange} />
          </label>

          <label>Marca:
            <input type="text" name="brand" value={formData.brand} onChange={handleChange} />
          </label>

          <label>Modelo:
            <input type="text" name="model" value={formData.model} onChange={handleChange} />
          </label>

          <label>Categoría:
            <input type="text" name="category" value={formData.category} onChange={handleChange} />
          </label>

          <label>Precio:
            <input type="number" name="price" value={formData.price} onChange={handleChange} />
          </label>

          <label>Descripción:
            <textarea name="description" value={formData.description} onChange={handleChange} />
          </label>

          <label>Fabricante:
            <input type="text" name="manufacturer" value={formData.manufacturer} onChange={handleChange} />
          </label>

          <label>URL del Manual:
            <input type="text" name="manualUrl" value={formData.manualUrl} onChange={handleChange} />
          </label>

          <div className="modal-actions">
            <button 
              className="btn-save" 
              onClick={handleUpdate} 
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
            <button className="btn-cancel" onClick={onClose}>Cancelar</button>
          </div>

          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
