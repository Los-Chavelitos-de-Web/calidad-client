import React from 'react';
import './admin-css/ProductsDetaills.css';

const DeleteConfirmationModal = ({ onCancel, onConfirm, productName }) => {
  return (
    <div className="modal-overlay">
      <div className="confirm-modal">
        <h3>¿Estás seguro de eliminar este producto?</h3>
        {productName && <p>Producto: <strong>{productName}</strong></p>}
        <p>Esta acción no se puede deshacer.</p>
        <div className="confirm-buttons">
          <button 
            className="cancel-btn"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button 
            className="delete-btn"
            onClick={onConfirm}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;