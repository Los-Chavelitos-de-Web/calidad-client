import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import './admin-css/reclamo-modal.css';

const ReclamoModal = ({ isOpen, onClose, reclamo }) => {
  if (!isOpen || !reclamo) return null;

  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy 'a las' HH:mm", {
      locale: es
    });
  };

  const getStatusBadge = (status) => {
    if (!status) return <span className="badge pending">Pendiente</span>;

    const cleanStatus = String(status).trim().toLowerCase();

    switch (cleanStatus) {
      case 'confirmada':
        return <span className="badge confirmada">Confirmada</span>;
      case 'cancelada':
        return <span className="badge cancelada">Cancelada</span>;
      case 'pendiente':
        return <span className="badge pending">Pendiente</span>;
      default:
        return <span className="badge unknown">{status}</span>;
    }
  };

  // Función para redirigir a Gmail con el correo del cliente
  const handleResponder = () => {
    const userEmail = reclamo.user?.email || reclamo.contact;
    if (userEmail) {
      const subject = `Respuesta a su reclamo: ${reclamo.title}`;
      const body = `Estimado/a,\n\nEn relación a su reclamo (ID: ${reclamo.id}) recibido el ${formatDate(reclamo.createdAt)}:\n\n`;
      
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(userEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(gmailUrl, '_blank');
    } else {
      alert('No se encontró dirección de correo para responder');
    }
  };

  return (
    <div className="modalOverlay">
      <div className="modalContainer">
        <div className="modalHeader">
          <h2>Detalles del Reclamo</h2>
          <button className="modalCloseBtn" onClick={onClose}>&times;</button>
        </div>
        <div className="modalBody">
          <div className="detailRow"><strong>ID:</strong> {reclamo.id}</div>
          <div className="detailRow"><strong>Usuario:</strong> {reclamo.user?.email || `ID: ${reclamo.userId}`}</div>
          <div className="detailRow"><strong>Título:</strong> {reclamo.title}</div>
          <div className="detailRow"><strong>Descripción:</strong> {reclamo.description}</div>
          <div className="detailRow"><strong>Fecha:</strong> {formatDate(reclamo.createdAt)}</div>
          <div className="detailRow"><strong>Estado:</strong> {getStatusBadge(reclamo.status)}</div>
          {reclamo.contact && (
            <div className="detailRow"><strong>Contacto:</strong> {reclamo.contact}</div>
          )}
        </div>
        <div className="modalFooter">
          <button 
            className="modalBtn-responderBtn" 
            onClick={handleResponder}
            disabled={!reclamo.user?.email && !reclamo.contact}
          >Responder
          </button>
          <button className="modalBtn" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default ReclamoModal;