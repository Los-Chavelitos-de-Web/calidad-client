import { useEffect, useState } from "react";
import AdminAside from "./template/AdminAside";
import { useNavigate } from "react-router-dom";
import { usePayload } from "../../utils/authHelpers";
import * as XLSX from 'xlsx';
import UserModal from "./user.modal.jsx";
import UserFilters from "./user-filter.jsx";
import './admin-css/users-view.css';

const UserView = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all"); // Nuevo estado para el filtro de roles
  const [newRole, setNewRole] = useState("");
  const { authToken, error, loading } = usePayload();

  const availableRoles = ["GERENTE", "ALMACEN_VENTAS", "CLIENTE"];

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

  const filteredUsers = users.filter(user => {
    // Filtro por término de búsqueda
    const matchesSearch = !searchTerm || 
      user.profile?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro por rol
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setNewRole("");
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
        setUsers(users.map(user => 
          user.id === selectedUser.id ? { ...user, isActive: newStatus } : user
        ));
        setSelectedUser({ ...selectedUser, isActive: newStatus });
      }
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };
  
  const changeUserRole = async () => {
    if (!selectedUser || !newRole || newRole === selectedUser.role) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BACK}/users/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          id: selectedUser.id,
          role: newRole
        })
      });

      if (response.ok) {
        setUsers(users.map(user => 
          user.id === selectedUser.id ? { ...user, role: newRole } : user
        ));
        setSelectedUser({ ...selectedUser, role: newRole });
        alert('Rol actualizado correctamente');
      }
    } catch (error) {
      console.error('Error al cambiar rol:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const translateRole = (role) => {
    const translations = {
      'GERENTE': 'Gerente',
      'ALMACEN_VENTAS': 'Almacén/Ventas',
      'CLIENTE': 'Cliente'
    };
    return translations[role] || role;
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

          <UserFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            users={users}
            filteredUsers={filteredUsers}
          />
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
                  <th className="cell-model">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="cell-name">{user.id}</td>
                      <td className="cell-id">{user.profile?.name || "No especificado"}</td>
                      <td className="cell-name">{user.email}</td>
                      <td className="cell-model">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="cell-id">{translateRole(user.role)}</td>
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
                            src="../icons/tres-puntos.png"
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
                      {searchTerm || roleFilter !== "all" 
                        ? "No hay usuarios que coincidan con los filtros" 
                        : "No hay usuarios registrados"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isModalOpen && selectedUser && (
        <UserModal
          selectedUser={selectedUser}
          newRole={newRole}
          availableRoles={availableRoles}
          translateRole={translateRole}
          formatDate={formatDate}
          onClose={handleCloseModal}
          onRoleChange={changeUserRole}
          onRoleSelectChange={setNewRole}
          onToggleStatus={toggleUserStatus}
        />
      )}
    </div>
  );
};

export default UserView;