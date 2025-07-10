import { useState } from "react";

const UserModal = ({ 
  selectedUser, 
  isModalOpen, 
  handleCloseModal, 
  toggleUserStatus,
  formatDate,
  authToken,
  onRoleUpdate
}) => {
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [newRole, setNewRole] = useState(selectedUser?.role || "");
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isModalOpen || !selectedUser) return null;

  // Roles disponibles según tu imagen
  const availableRoles = ["GERENTE", "ALMACEN_VENTAS", "CLIENTE"];

  const handleRoleChange = async () => {
    if (newRole === selectedUser.role) {
      setIsEditingRole(false);
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BACK}/users/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          newRole: newRole
        })
      });

      if (response.ok) {
        // Llamar a la función de actualización del padre
        onRoleUpdate(selectedUser.id, newRole);
        setIsEditingRole(false);
      } else {
        const errorData = await response.json();
        console.error('Error al actualizar el rol:', errorData);
        alert('Error al actualizar el rol');
      }
    } catch (error) {
      console.error('Error al actualizar el rol:', error);
      alert('Error al actualizar el rol');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
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
            <span className="detail-value">
              {isEditingRole ? (
                <div className="role-edit-container">
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="role-select"
                    disabled={isUpdating}
                  >
                    {availableRoles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleRoleChange}
                    className="role-save-btn"
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Guardando...' : 'Guardar'}
                  </button>
                  <button
                    onClick={() => {
                      setNewRole(selectedUser.role);
                      setIsEditingRole(false);
                    }}
                    className="role-cancel-btn"
                    disabled={isUpdating}
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <div className="role-display-container">
                  <span>{selectedUser.role}</span>
                  <button
                    onClick={() => setIsEditingRole(true)}
                    className="role-edit-btn"
                  >
                    Editar
                  </button>
                </div>
              )}
            </span>
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
  );
};

export default UserModal;