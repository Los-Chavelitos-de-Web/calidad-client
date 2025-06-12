import { useEffect, useState } from "react";
import AdminAside from "./template/AdminAside";
/*import './admin-css/admin.css';*/
import { useNavigate } from "react-router-dom";
import { usePayload } from "../../utils/authHelpers";

const ReservaView = () => {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { authToken, email, userId, username, role, error, loading } = usePayload();

  useEffect(() => {
    if (loading) return;
    if (error) {
      console.warn(error);
      navigate("/login");
      return;
    }
    getReservasData();
    getUsersData();
  }, [loading, error]);

  async function getReservasData() {
    try {
      setIsLoading(true);
      const res = await fetch(`${import.meta.env.VITE_APP_BACK}/reservas/getAll`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      const reservasData = await res.json();
      setReservas(reservasData);
    } catch (error) {
      console.error("Error al cargar reservas:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function getUsersData() {
    try {
      const res = await fetch(`${import.meta.env.VITE_APP_BACK}/users/getAll`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      const usersData = await res.json();
      
      const usersWithProfiles = await Promise.all(
        usersData.map(async (user) => {
          try {
            const profileRes = await fetch(`${import.meta.env.VITE_APP_BACK}/users/profile/${user.id}`, {
              headers: {
                'Authorization': `Bearer ${authToken}`
              }
            });
            const profileData = await profileRes.json();
            return { ...user, profile: profileData };
          } catch (error) {
            console.error(`Error al cargar perfil del usuario ${user.id}:`, error);
            return { ...user, profile: null };
          }
        })
      );
      
      setUsers(usersWithProfiles);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  }

  const handleOpenModal = (reserva) => {
    // Buscar el usuario correspondiente a la reserva
    const user = users.find(u => u.id === reserva.userId);
    setSelectedReserva({
      ...reserva,
      user: user || null
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReserva(null);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="admin-container">
      <div className="admin-aside-wrapper">
        <AdminAside />
      </div>
      
      <div className="admin-main-content">
        <div className="productos-content">
          <div className="productos-header">
            <h1>Reservas</h1>  
            <span className="product-count">{reservas.length} Reservas</span>
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
                {reservas.length > 0 ? (
                  reservas.map((reserva) => {
                    // Buscar el usuario correspondiente para mostrar su nombre en la tabla
                    const user = users.find(u => u.id === reserva.userId);
                    return (
                      <tr key={reserva.id}>
                        <td className="cell-id">{reserva.id}</td>
                        <td className="cell-name">
                          {user?.profile?.name || "Cliente " + reserva.userId}
                        </td>
                        <td className="cell-model">{new Date(reserva.createdAt).toLocaleDateString()}</td>
                        <td className="cell-category">${reserva.total?.toFixed(2)}</td>
                        <td className="cell-stock"> 
                          {reserva.status || "N/A"}
                        </td>
                        <td className="cell-actions">
                          <button 
                            className="action-btn"
                            onClick={() => handleOpenModal(reserva)}
                          >
                            <img 
                              src="../public/icons/tres-puntos.png" 
                              alt="Opciones" 
                              className="action-icon"
                            />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr className="no-results">
                    <td colSpan="6">No hay reservas</td> 
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal para mostrar los detalles de la reserva */}
      {isModalOpen && selectedReserva && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Detalles de la Reserva</h2>
              <button className="modal-close-btn" onClick={handleCloseModal}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="user-detail-row">
                <span className="detail-label">ID Reserva:</span>
                <span className="detail-value">{selectedReserva.id}</span>
              </div>
              <div className="user-detail-row">
                <span className="detail-label">Cliente:</span>
                <span className="detail-value">
                  {selectedReserva.user?.profile?.name || "Cliente " + selectedReserva.userId}
                </span>
              </div>
              {selectedReserva.user && (
                <>
                  <div className="user-detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{selectedReserva.user.email || "N/A"}</span>
                  </div>
                </>
              )}
              <div className="user-detail-row">
                <span className="detail-label">Total:</span>
                <span className="detail-value">${selectedReserva.total?.toFixed(2)}</span>
              </div>
              <div className="user-detail-row">
                <span className="detail-label">Estado:</span>
                <span className="detail-value">{selectedReserva.status || "N/A"}</span>
              </div>
              <div className="user-detail-row">
                <span className="detail-label">Fecha de creación:</span>
                <span className="detail-value">{formatDate(selectedReserva.createdAt)}</span>
              </div>
              <div className="user-detail-row">
                <span className="detail-label">Última actualización:</span>
                <span className="detail-value">{formatDate(selectedReserva.updatedAt)}</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn" onClick={handleCloseModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservaView;