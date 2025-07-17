import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminAside.css'; // Asegúrate que existe y está bien ubicado
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />


const AdminAside = () => {
  const navigate = useNavigate();

  return (
    <aside className="admin-aside d-flex flex-column justify-content-between">
      <nav className="p-4">
        <h2 className="fs-4 fw-bold mb-4">Admin</h2>
        <ul className="nav flex-column">
          <li className="nav-item">
            <a
            onClick={() => navigate('/admin/dash')} 
            className="nav-link aside-link">
              <i className="bi bi-speedometer2 me-2"></i> Dashboard
            </a>
          </li>
          <li className="nav-item">
            <a
            onClick={() => navigate('/admin/ventas')}
            className="nav-link aside-link">
              <i className="bi bi-cart3 me-2"></i> Ventas
            </a>
          </li>
          <li className="nav-item">
            <a 
            onClick={() => navigate('/admin/productos')}
            className="nav-link aside-link">
              <i className="bi bi-box-seam me-2"></i> Productos
            </a>
          </li>
          <li className="nav-item">
            <a 
            onClick={() => navigate('/admin/reservas')}
            className="nav-link aside-link">
              <i className="bi bi-calendar-event me-2"></i> Reservas
            </a>
          </li>
          <li className="nav-item">
            <a 
            onClick={() => navigate('/admin/users')}
            className="nav-link aside-link">
              <i className="bi bi-people me-2"></i> Usuarios
            </a>
          </li>
          <li className="nav-item">
            <a 
            onClick={() => navigate('/admin/reclamos')}
            className="nav-link aside-link">
              <i className="bi bi-people me-2"></i> Reclamaciones
            </a>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-top border-secondary">
        <ul className="nav flex-column">
          <li className="nav-item">
            <a 
              href="#" 
              className="nav-link aside-link"
              onClick={() => navigate('/')}
            >
              <i className="bi bi-person-circle me-2"></i> Vista Usuario
            </a>
          </li>
          <li className="nav-item">
            <a 
              href="#" 
              className="nav-link aside-link text-danger"
              onClick={() => navigate('/login')}
            >
              <i className="bi bi-box-arrow-right me-2"></i> Cerrar sesión
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default AdminAside;
