import { useEffect, useState } from "react";
import AdminAside from "./template/AdminAside";
import { useNavigate } from "react-router-dom";
import { usePayload } from "../../utils/authHelpers";
import * as XLSX from 'xlsx';

const ReclamosCard = () => {
  const navigate = useNavigate();
  const [reclamos, setReclamos] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReclamo, setSelectedReclamo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { authToken, error, loading } = usePayload();

  useEffect(() => {
    if (loading) return;
    if (error) {
      console.warn(error);
      navigate("/login");
      return;
    }
    getReclamosData();
    getUsersData();
  }, [loading, error]);

  async function getReclamosData() {
    try {
      setIsLoading(true);
      const res = await fetch(`${import.meta.env.VITE_APP_BACK}/libro-reclamaciones`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      const reclamosData = await res.json();
      setReclamos(reclamosData);
    } catch (error) {
      console.error("Error al cargar reclamos:", error);
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
      setUsers(usersData);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  }

  const filteredReclamos = reclamos.filter(reclamo => {
    if (!searchTerm) return true;
    
    const user = users.find(u => u.id === reclamo.userId);
    const userName = user?.profile?.name || "";
    const reclamoTitle = reclamo.title || "";
    const reclamoDesc = reclamo.description || "";
    
    return (
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reclamoTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reclamoDesc.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const exportToExcel = () => {
    const dataToExport = filteredReclamos.map(reclamo => {
      const user = users.find(u => u.id === reclamo.userId);
      return {
        'ID': reclamo.id,
        'Usuario': user?.email || `ID: ${reclamo.userId}`,
        'Título': reclamo.title || "Sin título",
        'Descripción': reclamo.description || "Sin descripción",
        'Fecha': new Date(reclamo.createdAt).toLocaleDateString(),
        'Estado': reclamo.status || "PENDIENTE",
        'Tipo': reclamo.type || "QUEJA",
        'Contacto': reclamo.contact || "N/A"
      };
    });

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reclamos");
    XLSX.writeFile(wb, `reclamos_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleOpenModal = (reclamo) => {
    const user = users.find(u => u.id === reclamo.userId);
    setSelectedReclamo({
      ...reclamo,
      user: user || null
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReclamo(null);
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('es-PE', options);
  };

  const getStatusBadge = (status) => {
    switch(status?.toUpperCase()) {
      case 'RESUELTO':
        return <span className="badge resolved">Resuelto</span>;
      case 'EN PROCESO':
        return <span className="badge in-progress">En Proceso</span>;
      default:
        return <span className="badge pending">Pendiente</span>;
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-aside-wrapper">
        <AdminAside />
      </div>
      
      <div className="admin-main-content">
        <div className="productos-content">
          <div className="productos-header">
            <h1>Libro de Reclamaciones</h1>  
            <div className="header-actions">
              <span className="product-count">{filteredReclamos.length} Reclamos</span>
            </div>
          </div>
          
          <div className="search-export-container">
            <div className="search-container">
              <input
                type="text"
                placeholder="Buscar por usuario, título o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>
        
        <div className="table-container">
          {isLoading ? (
            <div className="loading-indicator">Cargando reclamos...</div>
          ) : (
            <table className="products-table">
              <thead>
                <tr>
                  <th className="column-id">ID</th>
                  <th className="column-user">Usuario</th>
                  <th className="column-title">Título</th>
                  <th className="column-date">Fecha</th>
                  <th className="column-status">Estado</th>
                  <th className="cell-actions"></th>
                </tr>
              </thead>
              <tbody>
                {filteredReclamos.length > 0 ? (
                  filteredReclamos.map((reclamo) => {
                    const user = users.find(u => u.id === reclamo.userId);
                    return (
                      <tr key={reclamo.id}>
                        <td className="cell-id">{reclamo.id}</td>
                        <td className="cell-user">
                          {user?.email || `ID: ${reclamo.userId}`}
                        </td>
                        <td className="cell-title">{reclamo.title || "Sin título"}</td>
                        <td className="cell-date">{new Date(reclamo.createdAt).toLocaleDateString()}</td>
                        <td className="cell-status">
                          {getStatusBadge(reclamo.status)}
                        </td>
                        <td className="cell-actions">
                          <button 
                            className="action-btn"
                            onClick={() => handleOpenModal(reclamo)}
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
                    );
                  })
                ) : (
                  <tr className="no-results">
                    <td colSpan="6">
                      {searchTerm ? "No hay reclamos que coincidan con la búsqueda" : "No hay reclamos registrados"}
                    </td> 
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isModalOpen && selectedReclamo && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Detalles del Reclamo</h2>
              <button className="modal-close-btn" onClick={handleCloseModal}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">ID:</span>
                <span className="detail-value">{selectedReclamo.id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Usuario:</span>
                <span className="detail-value">
                  {selectedReclamo.user?.email || `ID: ${selectedReclamo.userId}`}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Título:</span>
                <span className="detail-value">{selectedReclamo.title || "Sin título"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Descripción:</span>
                <p className="detail-description">{selectedReclamo.description || "Sin descripción"}</p>
              </div>
              <div className="detail-row">
                <span className="detail-label">Fecha:</span>
                <span className="detail-value">{formatDate(selectedReclamo.createdAt)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Estado:</span>
                <span className="detail-value">
                  {getStatusBadge(selectedReclamo.status)}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Tipo:</span>
                <span className="detail-value">{selectedReclamo.type || "QUEJA"}</span>
              </div>
              {selectedReclamo.contact && (
                <div className="detail-row">
                  <span className="detail-label">Contacto:</span>
                  <span className="detail-value">{selectedReclamo.contact}</span>
                </div>
              )}
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

export default ReclamosCard;