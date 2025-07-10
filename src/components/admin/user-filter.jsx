import React from 'react';
import PropTypes from 'prop-types';
import * as XLSX from 'xlsx';

const UserFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  roleFilter, 
  setRoleFilter, 
  users,
  filteredUsers 
}) => {
  // Función para obtener roles únicos
  const getUniqueRoles = () => {
    const roles = new Set(users.map(user => user.role));
    return ["all", ...Array.from(roles)].sort();
  };

  // Función para exportar a Excel
  const exportToExcel = () => {
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

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Usuarios");
    XLSX.writeFile(wb, "usuarios.xlsx");
  };

  return (
    <div className="search-export-container">
      <div className="filters-container">
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          aria-label="Buscar usuarios"
        />
      
        <div className="role-filter-container">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="role-filter-select"
            aria-label="Filtrar por rol"
          >
            {getUniqueRoles().map(role => (
              <option key={role} value={role}>
                {role === "all" ? "Todos los roles" : role}
              </option>
            ))}
          </select>
        </div>
        
        <button 
          onClick={exportToExcel}
          className="btn-excel"
          aria-label="Exportar a Excel"
        >
          <img 
            src="/icons/img-excel.png" 
            className="img-excel"
            alt="Exportar a Excel"
          />
          <span className="btn-excel-text">Exportar</span>
        </button>
      </div>
    </div>
  );
};

// Definición de PropTypes
UserFilters.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  roleFilter: PropTypes.string.isRequired,
  setRoleFilter: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      role: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      isActive: PropTypes.bool.isRequired,
      createdAt: PropTypes.string.isRequired,
      profile: PropTypes.shape({
        name: PropTypes.string,
        phone: PropTypes.string,
        address: PropTypes.string
      })
    })
  ).isRequired,
  filteredUsers: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default UserFilters;