import { useEffect, useState } from "react";
import AdminAside from "./template/AdminAside";
import './admin-css/admin.css';
import './admin-css/ProductsDetaills.css';
import { useNavigate } from "react-router-dom";


const ProductosView = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  async function getData() {
    try {
      setIsLoading(true);
      const res = await fetch(`${import.meta.env.VITE_APP_BACK}/products/getAll`);
      const productos = await res.json();
      setData(productos);
      setFilteredData(productos);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const getStock = (stockData) => {
    if (!stockData) return 0;
    return Object.values(stockData).reduce((sum, val) => sum + (val || 0), 0);
  };

  useEffect(() => {
    if (!searchTerm) {
      setFilteredData(data);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = data.filter(producto => 
        producto.title.toLowerCase().includes(term) || 
        producto.brand.toLowerCase().includes(term) ||
        producto.model.toLowerCase().includes(term)
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, data]);

  const handleOpenModal = (producto) => {
    setSelectedProduct(producto);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  // Función para formatear las claves de las especificaciones
  const formatSpecKey = (key) => {
    const words = key.replace(/([A-Z])/g, ' $1');
    return words.charAt(0).toUpperCase() + words.slice(1);
  };

  // Función para renderizar el valor de las especificaciones
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

  return (
    <div className="admin-container">
      <div className="admin-aside-wrapper">
        <AdminAside/>
      </div>
      
      <div className="admin-main-content">
        <div className="productos-content">
          <div className="productos-header">
            <h1>Lista de productos</h1>
            <span className="product-count">{filteredData.length} productos</span>
          </div>
        </div>
        
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar por nombre, marca o modelo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button 
          onClick={() => navigate('/admin/insertar')}
          >
            Agregar Producto +

          </button>
        </div>
        
        <div className="table-container">
          {isLoading ? (
            <div className="loading-indicator">Cargando productos...</div>
          ) : (
            <table className="products-table">
              <thead>
                <tr>
                  <th className="column-id">ID</th>
                  <th className="column-name">Producto</th>
                  <th className="column-brand">Marca</th>
                  <th className="column-model">Modelo</th>
                  <th className="column-category">Categoría</th>
                  <th className="column-stock">Stock</th>
                  <th className="column-actions"></th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((producto) => (
                    <tr key={producto.id}>
                      <td className="cell-id">{producto.id}</td>
                      <td className="cell-name">{producto.title}</td>
                      <td className="cell-brand">{producto.brand}</td>
                      <td className="cell-model">{producto.model}</td>
                      <td className="cell-category">{producto.category}</td>
                      <td className={`cell-stock ${getStock(producto.stock) === 0 ? 'out-of-stock' : ''}`}>
                        {getStock(producto.stock)}
                      </td>
                      <td className="cell-actions">
                        <button 
                          className="action-btn"
                          onClick={() => handleOpenModal(producto)}
                        >
                          <img 
                            src="../public/icons/tres-puntos.png" 
                            alt="Opciones" 
                            className="action-icon"
                          />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="no-results">
                    <td colSpan="7">
                      {searchTerm ? "No se encontraron productos" : "No hay productos disponibles"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={handleCloseModal}>
              &times;
            </button>
            <h2>Detalles del Producto</h2>
            {selectedProduct && (
              <div className="product-details">
                <div className="basic-info">
                  <p><strong>Nombre:</strong> {selectedProduct.title}</p>
                  <p><strong>Marca:</strong> {selectedProduct.brand}</p>
                  <p><strong>Modelo:</strong> {selectedProduct.model}</p>
                  <p><strong>Categoría:</strong> {selectedProduct.category}</p>
                  <p><strong>Stock total:</strong> {getStock(selectedProduct.stock)}</p>
                </div>
                <div className="specs-section">
                  <h4>Especificaciones Técnicas</h4>
                  {selectedProduct.specs ? (
                    <table className="specs-table">
                      <tbody>
                        {Object.entries(selectedProduct.specs).map(([key, value]) => (
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
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductosView;