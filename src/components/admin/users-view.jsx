import { useEffect, useState } from "react";
import AdminAside from "./template/AdminAside";
import { useNavigate } from "react-router-dom";
import { usePayload } from "../../utils/authHelpers";
import * as XLSX from 'xlsx'; // Importar la librería para exportar a Excel

const UserView = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
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

  // Función para filtrar usuarios por nombre o email
  const filteredUsers = users.filter(user => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = user.profile?.name?.toLowerCase().includes(searchLower) || false;
    const emailMatch = user.email.toLowerCase().includes(searchLower);
    
    return nameMatch || emailMatch;
  });

  // Función para exportar a Excel
  const exportToExcel = () => {
    // Preparar los datos para exportar
    const dataToExport = filteredUsers.map(user => ({
      ID: user.id,
      Nombre: user.profile?.name || "No especificado",
      Email: user.email,
      Rol: user.role,
      Estado: user.isActive ? "Activo" : "Inactivo",
      'Fecha Registro': new Date(user.createdAt).toLocaleDateString(),
      'Teléfono': user.profile?.phone || "N/A",
      'Dirección': user.profile?.address || "N/A"
    }));

    // Crear hoja de trabajo
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    // Crear libro de trabajo
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Usuarios");
    // Exportar el archivo
    XLSX.writeFile(wb, "usuarios.xlsx");
  };

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
            <span className="product-count">{filteredUsers.length} usuarios</span>
          </div>

          {/* Barra de búsqueda y botón de exportación */}
          <div className="search-export-container" >
            <div className="search-container" style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button 
              onClick={exportToExcel}
              className="btn-excel">
              <img 
                src="/icons/img-excel.png" 
                className="img-excel"
              />
            </button>
            </div>
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
                  <th className="cell-category">Estado</th>
                  <th className="cell-actions">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
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
                    <td colSpan="7">
                      {searchTerm ? "No hay usuarios que coincidan con la búsqueda" : "No hay usuarios registrados"}
                    </td>
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
              {selectedUser.profile?.phone && (
                <div className="user-detail-row">
                  <span className="detail-label">Teléfono:</span>
                  <span className="detail-value">{selectedUser.profile.phone}</span>
                </div>
              )}
              {selectedUser.profile?.address && (
                <div className="user-detail-row">
                  <span className="detail-label">Dirección:</span>
                  <span className="detail-value">{selectedUser.profile.address}</span>
                </div>
              )}
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