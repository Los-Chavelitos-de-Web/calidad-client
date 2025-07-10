import { useEffect, useState } from "react";
import AdminAside from "./template/AdminAside";
import './admin-css/sales-view.css';
import { useNavigate } from "react-router-dom";
import { usePayload } from "../../utils/authHelpers";
import SaleDetailsModal from "./sales-modal";

// Función helper para formatear precios
const formatPrice = (price) => {
  return Number(price || 0).toFixed(2);
};

const SalesView = () => {
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { authToken, error, loading } = usePayload();
  
  // Estados para el filtro de fechas
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: '',
    filterType: 'all'
  });

  // Estados para el modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSale, setCurrentSale] = useState(null);

  // Función para aplicar filtros de fecha
  const applyDateFilter = () => {
    if (!sales.length) return;

    let filtered = [...sales];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (dateFilter.filterType) {
      case 'today':
        filtered = filtered.filter(sale => {
          const saleDate = new Date(sale.createdAt);
          return saleDate.toDateString() === today.toDateString();
        });
        break;
      
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        filtered = filtered.filter(sale => {
          const saleDate = new Date(sale.createdAt);
          return saleDate >= weekAgo;
        });
        break;
      
      case 'month':
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        filtered = filtered.filter(sale => {
          const saleDate = new Date(sale.createdAt);
          return saleDate >= monthAgo;
        });
        break;
      
      case 'custom':
        if (dateFilter.startDate && dateFilter.endDate) {
          const start = new Date(dateFilter.startDate);
          const end = new Date(dateFilter.endDate);
          end.setHours(23, 59, 59, 999);
          
          filtered = filtered.filter(sale => {
            const saleDate = new Date(sale.createdAt);
            return saleDate >= start && saleDate <= end;
          });
        }
        break;
      
      default:
        break;
    }

    setFilteredSales(filtered);
  };

  useEffect(() => {
    if (loading) return;

    if (error) {
      console.warn(error);
      navigate("/login");
      return;
    }

    getSalesData();
  }, [loading, error]);
  
  async function getSalesData() {
    try {
      setIsLoading(true);
      const res = await fetch(`${import.meta.env.VITE_APP_BACK}/sales/getAll`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      const salesData = await res.json();
      setSales(salesData);
      setFilteredSales(salesData);
    } catch (error) {
      console.error("Error al cargar ventas:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    applyDateFilter();
  }, [dateFilter, sales]);

  const handleOpenModal = (sale) => {
    setIsModalOpen(true);
    setCurrentSale(sale);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentSale(null);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setDateFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuickFilter = (filterType) => {
    setDateFilter(prev => ({
      ...prev,
      filterType,
      startDate: '',
      endDate: ''
    }));
  };

  const resetFilters = () => {
    setDateFilter({
      startDate: '',
      endDate: '',
      filterType: 'all'
    });
  };

  return (
    <div className="admin-container">
      <div className="admin-aside-wrapper">
        <AdminAside />
      </div>
      
      <div className="admin-main-content">
        <div className="productos-content">
          <div className="productos-header">
            <h1>Ventas</h1>  
            <span className="product-count">{filteredSales.length} ventas</span>
          </div>
          
          <div className="sales-filters">
            <div className="quick-filters">
              <button 
                className={`filter-btn ${dateFilter.filterType === 'all' ? 'active' : ''}`}
                onClick={() => handleQuickFilter('all')}
              >
                Todas
              </button>
              <button 
                className={`filter-btn ${dateFilter.filterType === 'today' ? 'active' : ''}`}
                onClick={() => handleQuickFilter('today')}
              >
                Hoy
              </button>
              <button 
                className={`filter-btn ${dateFilter.filterType === 'week' ? 'active' : ''}`}
                onClick={() => handleQuickFilter('week')}
              >
                Esta semana
              </button>
              <button 
                className={`filter-btn ${dateFilter.filterType === 'month' ? 'active' : ''}`}
                onClick={() => handleQuickFilter('month')}
              >
                Este mes
              </button>
              <button 
                className={`filter-btn ${dateFilter.filterType === 'custom' ? 'active' : ''}`}
                onClick={() => handleQuickFilter('custom')}
              >
                Personalizado
              </button>
            </div>
            
            {dateFilter.filterType === 'custom' && (
              <div className="custom-date-filters">
                <div className="date-input-group">
                  <label>Desde:</label>
                  <input
                    type="date"
                    name="startDate"
                    value={dateFilter.startDate}
                    onChange={handleFilterChange}
                    max={dateFilter.endDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className="date-input-group">
                  <label>Hasta:</label>
                  <input
                    type="date"
                    name="endDate"
                    value={dateFilter.endDate}
                    onChange={handleFilterChange}
                    min={dateFilter.startDate}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <button 
                  className="reset-btn"
                  onClick={resetFilters}
                >
                  Reiniciar
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="table-container">
          {isLoading ? (
            <div className="loading-indicator">Cargando ventas...</div>
          ) : (
            <table className="products-table">
              <thead>
                <tr>
                  <th className="column-cod">Código</th>
                  <th className="column-client">Cliente</th>
                  <th className="column-date">Fecha</th>
                  <th className="column-total">Total</th>
                  <th className="column-state">Estado</th>
                  <th className="cell-actions"></th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.length > 0 ? (
                  filteredSales.map((sale) => (
                    <tr key={sale.id}>
                      <td className="cell-cod">{sale.id}</td>
                      <td className="cell-client">{sale.userId || "N/A"}</td>
                      <td className="cell-date">{new Date(sale.createdAt).toLocaleDateString()}</td>
                      <td className="cell-total">S/.{formatPrice(sale.total)}</td>
                      <td className="cell-state">
                        {sale.status || "N/A"}
                      </td>
                      <td className="cell-actions">
                        <button 
                          className="action-btn"
                          onClick={() => handleOpenModal(sale)}
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
                    <td colSpan="6">No hay compra {dateFilter.filterType !== 'all' ? 'para este período' : ''}</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <SaleDetailsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        sale={currentSale}
        authToken={authToken}
      />
    </div>
  );
};

export default SalesView;