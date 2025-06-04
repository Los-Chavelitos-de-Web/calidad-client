import { useEffect, useState } from "react";
import AdminAside from "./template/AdminAside";
import './admin-css/admin.css';
import { useNavigate } from "react-router-dom";
import { usePayload } from "../../utils/authHelpers";

const ReservaView = () => {
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { authToken, email, userId, username, role, error, loading } = usePayload();
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
      const res = await fetch(`${import.meta.env.VITE_APP_BACK}/reservas/getAll`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      const salesData = await res.json();
      setSales(salesData);
    } catch (error) {
      console.error("Error al cargar reservas:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getSalesData();
  }, []);

  return (
    <div className="admin-container">
      <div className="admin-aside-wrapper">
        <AdminAside />
      </div>
      
      <div className="admin-main-content">
        <div className="productos-content">
          <div className="productos-header">
            <h1>Reservas </h1>  
            <span className="product-count">{sales.length} Reservas</span>
          </div>
        </div>
        
        <div className="table-container">
          {isLoading ? (
            <div className="loading-indicator">Cargando reservas...</div>
          ) : (
            <table className="products-table">
              <thead>
                <tr>
                  <th className="column-id">Código</th>
                  <th className="column-brand">Cliente</th>
                  <th className="column-model">Fecha</th>
                  <th className="column-category">Total</th>
                  <th className="column-stock">Estado</th>
                  <th className="cell-actions"></th>
                </tr>
              </thead>
              <tbody>
                {sales.length > 0 ? (
                  sales.map((sale) => (
                    <tr key={sale.id}>
                      <td className="cell-id">{sale.id}</td>
                      <td className="cell-name">{sale.userId || "N/A"}</td>
                      <td className="cell-model">{new Date(sale.createdAt).toLocaleDateString()}</td>
                      <td className="cell-category">${sale.total?.toFixed(2)}</td>
                      <td className="cell-stock"> 
                        {sale.status || "N/A"}
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
                    <td colSpan="5">No hay reservas</td> 
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservaView;