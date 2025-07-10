import React from 'react';
import PropTypes from 'prop-types';

const UserModal = ({ 
  selectedUser, 
  newRole, 
  availableRoles, 
  translateRole, 
  formatDate,
  onClose, 
  onRoleChange, 
  onRoleSelectChange,
  onToggleStatus 
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Detalles del Usuario</h2>
          <button className="modal-close-btn" onClick={onClose}>
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
            <span className="detail-label">Nombre:</span>
            <span className="detail-value">
              {selectedUser.profile?.name || "No especificado"}
            </span>
          </div>
          <div className="user-detail-row">
            <span className="detail-label">Rol actual:</span>
            <span className="detail-value">{translateRole(selectedUser.role)}</span>
          </div>
          <div className="user-detail-row">
            <span className="detail-label">Cambiar rol:</span>
            <div className="role-change-container">
              <select 
                className="role-select"
                value={newRole}
                onChange={(e) => onRoleSelectChange(e.target.value)}
              >
                {availableRoles.map(role => (
                  <option key={role} value={role}>
                    {translateRole(role)}
                  </option>
                ))}
              </select>
              <button 
                className="change-role-btn"
                onClick={onRoleChange}
                disabled={newRole === selectedUser.role}
              >
                Cambiar Rol
              </button>
            </div>
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
            <span className="detail-label">Registro:</span>
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
            onClick={onToggleStatus}
          >
            {selectedUser.isActive ? 'Desactivar' : 'Activar'}
          </button>
          <button className="modal-btn close-btn" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

UserModal.propTypes = {
  selectedUser: PropTypes.object.isRequired,
  newRole: PropTypes.string.isRequired,
  availableRoles: PropTypes.array.isRequired,
  translateRole: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onRoleChange: PropTypes.func.isRequired,
  onRoleSelectChange: PropTypes.func.isRequired,
  onToggleStatus: PropTypes.func.isRequired
};

export default UserModal;