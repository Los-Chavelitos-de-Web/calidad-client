import AdminAside from "./template/AdminAside";
import { useEffect, useState } from "react";
import './admin-css/admin.css';
import { useNavigate } from "react-router-dom";

const SalesView = () => {
  const navigate = useNavigate();
  const [ventas, setVentas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Función para formatear moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obtener datos de ventas
  async function getVentas() {
  try {
    setIsLoading(true);
    const token = localStorage.getItem("token"); // Obtén el token guardado al hacer login

    if (!token) {
      navigate("/login"); // Redirige si no hay token
      return;
    }

    const res = await fetch(`${import.meta.env.VITE_APP_BACK}/sales/getAll`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      localStorage.removeItem("token"); // Elimina el token inválido
      navigate("/login"); // Redirige a login
      return;
    }

    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${await res.text()}`);
    }

    const data = await res.json();
    setVentas(data);
  } catch (error) {
    console.error("Error al obtener ventas:", error);
    alert("No se pudieron cargar las ventas. Intenta de nuevo.");
  } finally {
    setIsLoading(false);
  }
}

  useEffect(() => {
    getVentas();
  }, []);

  return (
    <div className="admin-container">
      <div className="admin-aside-wrapper">
        <AdminAside/>
      </div>
      
      <div className="admin-main-content">
        <div className="productos-content">
          <div className="productos-header">
            <h1>Historial de Ventas</h1>
            <span className="product-count">{ventas.length} ventas registradas</span>
          </div>
        </div>
        
        <div className="table-container">
          {isLoading ? (
            <div className="loading-indicator">Cargando ventas...</div>
          ) : (
            <table className="products-table">
              <thead>
                <tr>
                  <th className="column-id">ID</th>
                  <th className="column-user">User ID</th>
                  <th className="column-date">Fecha</th>
                  <th className="column-total">Total</th>
                  <th className="column-status">Estado</th>
                </tr>
              </thead>
              <tbody>
                {ventas.length > 0 ? (
                  ventas.map((venta) => (
                    <tr key={venta.id}>
                      <td className="cell-id">#{venta.id}</td>
                      <td className="cell-user">{venta.userId}</td>
                      <td className="cell-date">{formatDate(venta.createdAt)}</td>
                      <td className="cell-total">
                        {formatCurrency(venta.total)}
                      </td>
                      <td className="cell-status">
                        <span className={`status-badge ${venta.estado.toLowerCase()}`}>
                          {venta.estado}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="no-results">
                    <td colSpan="5">No hay ventas registradas</td>
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

export default SalesView;