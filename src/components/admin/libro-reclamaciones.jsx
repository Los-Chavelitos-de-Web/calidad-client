import { useEffect, useState } from "react";
import AdminAside from "./template/AdminAside";
import { useNavigate } from "react-router-dom";
import { usePayload } from "../../utils/authHelpers";
import ReclamoModal from "./reclamo-modal.jsx";
import './admin-css/reclamo-modal.css';

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
      console.log("Reclamos recibidos:", reclamosData); // VERIFICA STATUS
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
    const reclamoStat = reclamo.status || "";
    return (
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reclamoTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reclamoDesc.toLowerCase().includes(searchTerm.toLowerCase())||
      reclamoStat.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleOpenModal = (reclamo) => {
    const user = users.find(u => u.id === reclamo.userId);
    setSelectedReclamo({ ...reclamo, user: user || null });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReclamo(null);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-PE', options);
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
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Título</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredReclamos.length > 0 ? (
                  filteredReclamos.map((reclamo) => {
                    const user = users.find(u => u.id === reclamo.userId);
                    return (
                      <tr key={reclamo.id}>
                        <td>{reclamo.id}</td>
                        <td>{user?.email || `ID: ${reclamo.userId}`}</td>
                        <td>{reclamo.title || "Sin título"}</td>
                        <td>{new Date(reclamo.createdAt).toLocaleDateString()}</td>
                        <td>{reclamo.status}</td>
                        <td>
                          <button className="action-btn" onClick={() => handleOpenModal(reclamo)} title="Ver detalles">
                            <img src="../public/icons/tres-puntos.png" alt="Opciones" className="action-icon" />
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
              <button className="modal-close-btn" onClick={handleCloseModal}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="detail-row"><strong>ID:</strong> {selectedReclamo.id}</div>
              <div className="detail-row"><strong>Usuario:</strong> {selectedReclamo.user?.email || `ID: ${selectedReclamo.userId}`}</div>
              <div className="detail-row"><strong>Título:</strong> {selectedReclamo.title}</div>
              <div className="detail-row"><strong>Descripción:</strong> {selectedReclamo.description}</div>
              <div className="detail-row"><strong>Fecha:</strong> {formatDate(selectedReclamo.createdAt)}</div>
              <div className="detail-row"><strong>Estado:</strong> {selectedReclamo.status}</div>
              {selectedReclamo.contact && <div className="detail-row"><strong>Contacto:</strong> {selectedReclamo.contact}</div>}
            </div>
            <div className="modal-footer">
              <button className="modal-btn" onClick={handleCloseModal}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReclamosCard;