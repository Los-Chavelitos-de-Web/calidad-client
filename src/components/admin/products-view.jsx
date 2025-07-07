import { useEffect, useState } from "react";
import AdminAside from "./template/AdminAside";
import { useNavigate } from "react-router-dom";
import { usePayload } from "../../utils/authHelpers";
import ProductDetailsModal from "./productDetailsModal";
import DeleteConfirmationModal from "./deleteConfirmationModal";
import FormularioProducto from "./controller/InsertProduct"; // Importamos el formulario
import { exportProductsToExcel } from "./exportToExcel";
import './admin-css/products-view.css';
import './admin-css/ProductsDetaills.css';

const ProductosView = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false); // Estado para el formulario modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const { authToken } = usePayload();

  // Obtener datos de productos
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

  // Calcular stock total
  const getStock = (stockData) => {
    if (!stockData) return 0;
    return Object.values(stockData).reduce((sum, val) => sum + (val || 0), 0);
  };

  // Filtrar productos
  useEffect(() => {
    if (!searchTerm) {
      setFilteredData(data);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = data.filter(producto => 
        producto.title.toLowerCase().includes(term) || 
        producto.brand.toLowerCase().includes(term) ||
        producto.model.toLowerCase().includes(term) ||
        producto.category.toLowerCase().includes(term)
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, data]);

  // Manejar exportación a Excel
  const handleExport = async () => {
    try {
      await exportProductsToExcel(filteredData, getStock);
    } catch (error) {
      alert(error.message);
    }
  };

  // Modal handlers
  const handleOpenDetailsModal = (producto) => {
    setSelectedProduct(producto);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedProduct(null);
  };

  // Form modal handlers
  const handleOpenFormModal = () => {
    setShowFormModal(true);
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
  };

  const handleProductCreated = () => {
    getData(); // Refrescar la lista después de crear
    handleCloseFormModal();
  };

  // Delete handlers
  const handleDeleteClick = (producto) => {
    setProductToDelete(producto);
    setShowDeleteConfirm(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setProductToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BACK}/products/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ id: productToDelete.id })
      });

      if (response.ok) {
        await getData();
        alert('Producto eliminado correctamente');
      } else {
        const errorData = await response.json();
        alert(`Error al eliminar producto: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('Error al conectar con el servidor');
    } finally {
      setShowDeleteConfirm(false);
      setProductToDelete(null);
    }
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
                            className="action-btn-delete-btn"
                            onClick={() => handleDeleteClick(producto)}
                            title="Eliminar producto"
                          >
                            <img 
                              src="/icons/delete-icon.png" 
                              alt="Eliminar" 
                              className="action-icon"
                            />
                          </button>
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

      {/* Modales */}
      {showDetailsModal && (
        <ProductDetailsModal 
          product={selectedProduct} 
          onClose={handleCloseDetailsModal} 
        />
      )}

      {showFormModal && (
        <FormularioProducto 
          isOpen={showFormModal}
          onClose={handleCloseFormModal}
          onProductCreated={handleProductCreated}
        />
      )}

      {showDeleteConfirm && (
        <DeleteConfirmationModal 
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          productName={productToDelete?.title}
        />
      )}
    </div>
  );
};

export default ProductosView;