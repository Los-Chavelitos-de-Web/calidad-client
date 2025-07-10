import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import './admin-css/sales-modal.css';

// Función helper para formatear precios
const formatPrice = (price) => {
  return Number(price || 0).toFixed(2);
};

const SaleDetailsModal = ({ 
  isOpen, 
  onClose, 
  sale, 
  authToken 
}) => {
  const [saleItems, setSaleItems] = useState([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);

  useEffect(() => {
    if (!isOpen || !sale) {
      setSaleItems([]);
      return;
    }

    const fetchSaleItems = async () => {
      try {
        setIsLoadingItems(true);
        const res = await fetch(`${import.meta.env.VITE_APP_BACK}/sales/items/${sale.id}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        
        const itemsData = await res.json();
        
        if (Array.isArray(itemsData)) {
          setSaleItems(itemsData);
        } else if (itemsData.items) {
          setSaleItems(itemsData.items);
        } else {
          console.error("Formato de datos inesperado:", itemsData);
          setSaleItems([]);
        }
      } catch (error) {
        console.error("Error al cargar items de venta:", error);
        setSaleItems([]);
      } finally {
        setIsLoadingItems(false);
      }
    };

    fetchSaleItems();
  }, [isOpen, sale, authToken]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Detalles de la Venta #{sale?.id}</h2>
          <button className="close-modal" onClick={onClose}>
            &times;
          </button>
        </div>
        
        <div className="modal-body">
          {isLoadingItems ? (
            <div className="loading-indicator">Cargando detalles...</div>
          ) : (
            <>
              <div className="sale-info">
                <div className="info-row">
                  <span className="info-label">Cliente:</span>
                  <span className="info-value">{sale?.userId || "N/A"}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Fecha:</span>
                  <span className="info-value">
                    {new Date(sale?.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Estado:</span>
                  <span className="info-value">{sale?.status || "N/A"}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Total:</span>
                  <span className="info-value">S/.{formatPrice(sale?.total)}</span>
                </div>
              </div>
              
              <h3>Productos</h3>
              <div className="sale-items-table">
                <table>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Precio Base</th>
                      <th>Código</th>
                    </tr>
                  </thead>
                  <tbody>
                    {saleItems.length > 0 ? (
                      saleItems.map((item, index) => (
                        <tr key={item.id || `item-${index}`}>
                          <td>{item.producto || "Producto no disponible"}</td>
                          <td>{item.cantidad}</td>
                          <td>S/.{formatPrice(item.precio_base)}</td>
                          <td>{item.codigo_producto || "N/A"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4">No hay productos en esta venta</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

SaleDetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  sale: PropTypes.object,
  authToken: PropTypes.string.isRequired
};

export default SaleDetailsModal;