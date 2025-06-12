import { useEffect, useState } from "react";
import AdminAside from "./template/AdminAside";
/*import "./admin-css/admin.css";*/
import { useNavigate } from "react-router-dom";
import { usePayload } from "../../utils/authHelpers";

const UserView = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { authToken, error, loading } = usePayload();

  useEffect(() => {
    if (loading) return;

    if (error) {
      console.warn(error);
      navigate("/login");
      return;
    }

    getUsersData();
  }, [loading, error]);

  async function getUsersData() {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const toggleUserStatus = async () => {
    if (!selectedUser) return;
    
    try {
      const newStatus = !selectedUser.isActive;
      
      const response = await fetch(`${import.meta.env.VITE_APP_BACK}/users/isActive`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          id: selectedUser.id,
          isActive: newStatus
        })
      });

      if (response.ok) {
        // Actualizar el estado local
        const updatedUsers = users.map(user => 
          user.id === selectedUser.id 
            ? { ...user, isActive: newStatus } 
            : user
        );
        
        setUsers(updatedUsers);
        setSelectedUser({ ...selectedUser, isActive: newStatus });
      } else {
        console.error('Error al cambiar el estado del usuario');
        const errorData = await response.json();
        console.error('Detalles del error:', errorData);
      }
    } catch (error) {
      console.error('Error al cambiar el estado del usuario:', error);
    }
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
            <h1>Usuarios</h1>
            <span className="product-count">{users.length} usuarios</span>
          </div>
        </div>

        <div className="table-container">
          {isLoading ? (
            <div className="loading-indicator">Cargando usuarios...</div>
          ) : (
            <table className="products-table">
              <thead>
                <tr>
                  <th className="column-id">ID</th>
                  <th className="column-category">Nombre</th>
                  <th className="column-brand">Email</th>
                  <th className="column-model">Fecha Registro</th>
                  <th className="column-category">Rol</th>
                  <th className="column-stock">Estado</th>
                  <th className="cell-actions">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td className="cell-name">{user.id}</td>
                      <td className="cell-id">
                        {user.profile?.name || "No especificado"}
                      </td>
                      <td className="cell-name">{user.email}</td>
                      <td className="cell-model">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="cell-id">{user.role}</td>
                      <td className="cell-stock">
                        <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                          {user.isActive ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="cell-actions">
                        <button
                          className="action-btn"
                          onClick={() => handleOpenModal(user)}
                          title="Ver detalles"
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
                    <td colSpan="7">No hay usuarios registrados</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal de detalles del usuario */}
      {isModalOpen && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Detalles del Usuario</h2>
              <button className="modal-close-btn" onClick={handleCloseModal}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="user-detail-row">
                <span className="detail-label">ID:</span>
                <span className="detail-value">{selectedUser.id}</span>
              </div>
              <div className="user-detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{selectedUser.email}</span>
              </div>
              <div className="user-detail-row">
                <span className="detail-label">Nombre completo:</span>
                <span className="detail-value">
                  {selectedUser.profile?.name || "No especificado"}
                </span>
              </div>
              <div className="user-detail-row">
                <span className="detail-label">Rol:</span>
                <span className="detail-value">{selectedUser.role}</span>
              </div>
              <div className="user-detail-row">
                <span className="detail-label">Estado:</span>
                <span className="detail-value">
                  <span className={`status-badge ${selectedUser.isActive ? 'active' : 'inactive'}`}>
                    {selectedUser.isActive ? "Activo" : "Inactivo"}
                  </span>
                </span>
              </div>
              <div className="user-detail-row">
                <span className="detail-label">Fecha de creación:</span>
                <span className="detail-value">{formatDate(selectedUser.createdAt)}</span>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className={`status-toggle-btn ${selectedUser.isActive ? 'deactivate' : 'activate'}`}
                onClick={toggleUserStatus}
              >
                {selectedUser.isActive ? 'Desactivar Usuario' : 'Activar Usuario'}
              </button>
              <button className="modal-btn close-btn" onClick={handleCloseModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserView;