import React, { useState } from 'react';

const EditProductModal = ({ product, onClose, onProductUpdated }) => {
  const [formData, setFormData] = useState({ ...product });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const authToken = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
