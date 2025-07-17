import { useEffect, useState } from "react";
import AdminAside from "./template/AdminAside";
import { useNavigate } from "react-router-dom";
import { usePayload } from "../../utils/authHelpers";
import ProductDetailsModal from "./productDetailsModal";
import FormularioProducto from "./controller/InsertProduct";
import { exportProductsToExcel } from "./exportToExcel";
import EditProductModal from "../admin/EditProductModal";
import './admin-css/products-view.css';
import './admin-css/ProductsDetaills.css';
import './admin-css/edit-modal.css';

const ProductosView = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { authToken } = usePayload();

  async function getData() {
    try {
      setIsLoading(true);
      const res = await fetch(`${import.meta.env.VITE_APP_BACK}/products/getAll`);
      const productos = await res.json();
      setData(productos);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const sortByStatusAndId = (list) => {
      return [...list].sort((a, b) => {
        if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
        return a.id - b.id;
      });
    };

    const term = searchTerm.toLowerCase();
    const filtered = data.filter(producto => 
      producto.title.toLowerCase().includes(term) || 
      producto.brand.toLowerCase().includes(term) ||
      producto.model.toLowerCase().includes(term) ||
      producto.category.toLowerCase().includes(term)
    );

    setFilteredData(sortByStatusAndId(filtered));
  }, [searchTerm, data]);

  const getStock = (stockData) => {
    if (!stockData) return 0;
    return Object.values(stockData).reduce((sum, val) => sum + (val || 0), 0);
  };

  const handleExport = async () => {
    try {
      await exportProductsToExcel(filteredData, getStock);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleOpenDetailsModal = (producto) => {
    setSelectedProduct(producto);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedProduct(null);
  };

  const handleOpenFormModal = () => {
    setShowFormModal(true);
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
  };

  const handleProductCreated = () => {
    getData();
    handleCloseFormModal();
  };

  const handleStatusChange = (updatedProduct) => {
    const updatedList = data.map((p) =>
      p.id === updatedProduct.id ? updatedProduct : p
    );
    setData(updatedList);
  };

  const handleOpenEditModal = (producto) => {
    setSelectedProduct(producto);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedProduct(null);
  };

  const handleProductUpdated = (updatedProduct) => {
    const updatedList = data.map((p) =>
      p.id === updatedProduct.id ? updatedProduct : p
    );
    setData(updatedList);
    handleCloseEditModal();
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
            placeholder="Buscar por nombre, marca, modelo o categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button 
            onClick={handleExport}
            className="btn-excel"
            disabled={filteredData.length === 0 || isLoading}
          >
            <img 
              src="/icons/img-excel.png" 
              className="img-excel"
              alt="Exportar a Excel"
            />
          </button>
          <button 
            onClick={handleOpenFormModal}
            className="btn-agregr-prod"
          >
            Agregar Producto
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
                  <th className="column-actions">Acciones</th>
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
                        <div className="action-buttons">
                          <button 
                            className="action-btn"
                            onClick={() => handleOpenDetailsModal(producto)}
                            title="Ver detalles"
                          >
                            <img 
                              src="/icons/tres-puntos.png" 
                              alt="Opciones" 
                              className="action-icon"
                            />
                          </button>
                          <button 
                            className="action-btn"
                            onClick={() => handleOpenEditModal(producto)}
                            title="Editar"
                          >
                            <img 
                              src="/icons/edit.png" 
                              alt="Editar" 
                              className="action-icon"
                            />
                          </button>
                        </div>
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

      {showDetailsModal && (
        <ProductDetailsModal 
          product={selectedProduct} 
          onClose={handleCloseDetailsModal} 
          onStatusChange={handleStatusChange} 
        />
      )}

      {showFormModal && (
        <FormularioProducto 
          isOpen={showFormModal}
          onClose={handleCloseFormModal}
          onProductCreated={handleProductCreated}
        />
      )}

      {showEditModal && (
        <EditProductModal
          product={selectedProduct}
          onClose={handleCloseEditModal}
          onProductUpdated={handleProductUpdated}
        />
      )}
    </div>
  );
};

export default ProductosView;
