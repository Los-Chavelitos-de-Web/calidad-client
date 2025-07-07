import React from 'react';
import './Perfil.css';
import NavBar from '../Nav/NavBar';
import Cookies from 'js-cookie';

const Perfil = () => {
  const user = {
    nombre: Cookies.get('username') || 'Name Apellido',
    email: Cookies.get('userEmail') || 'correo@ejemplo.com',
  };

  const opciones = [
    { titulo: 'Tu información', descripcion: 'Nombre elegido y datos para identificarte.', icono: '🧾', alerta: true },
    { titulo: 'Datos de tu cuenta', descripcion: 'Datos que representan tu cuenta.', icono: '👤', ok: true },
    { titulo: 'Seguridad', descripcion: 'Tienes configurada la seguridad.', icono: '🔒', ok: true },
    { titulo: 'Tarjetas', descripcion: 'Tarjetas guardadas en tu cuenta.', icono: '💳' },
    { titulo: 'Direcciones', descripcion: 'Direcciones guardadas.', icono: '📍' },
    { titulo: 'Privacidad', descripcion: 'Preferencias sobre uso de tus datos.', icono: '🛡️', disabled: true },
    { titulo: 'Comunicaciones', descripcion: 'Elige qué información quieres recibir.', icono: '💬' },
  ];

  return (
    <div className="perfil-container">
      <NavBar />
      <aside className="sidebar">
        <h2>Mi cuenta</h2>
        <ul>
          <li><a href="/reservas">🏷️ Mis reservas</a></li>
          <li><a href="/compras">🛒 Mis compras</a></li>
          
        </ul>
      </aside>

      <main className="perfil-main">
        <div className="perfil-header">
          <div className="perfil-avatar">
            {user.nombre.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
          <div>
            <h2>{user.nombre}</h2>
            <p>{user.email}</p>
          </div>
        </div>

        <div className="perfil-grid">
          {opciones.map((item, i) => (
            <div
              key={i}
              className={`perfil-card 
                ${item.ok ? 'ok' : ''} 
                ${item.alerta ? 'alerta' : ''} 
                ${item.disabled ? 'disabled' : ''}`}
            >
              <div className="perfil-card-icon">{item.icono}</div>
              <h3>{item.titulo}</h3>
              <p>{item.descripcion}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Perfil;
