import React, { useEffect, useState } from 'react';
import './Perfil.css';
import NavBar from '../Nav/NavBar';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const Perfil = () => {
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const token = Cookies.get('authToken'); // Asegúrate que así se llama tu cookie
        if (!token) {
          console.warn('Token no encontrado');
          return;
        }

        const decoded = jwtDecode(token);
        console.log('🔐 Token decodificado:', decoded);

const res = await fetch('http://localhost:3000/api/v1/users/${decoded.Id}', {
  headers: {
    'Authorization': 'Bearer ${token}',
    'Content-Type': 'application/json',
  }
});

        const data = await res.json();
        console.log('Datos recibidos del backend:', data);

        const perfilDetectado = {
          name: data.name || data.profile?.name || '',
          dni: data.dni || data.profile?.dni || '',
          email: data.email || data.user?.email || '',
        };

        setPerfil(perfilDetectado);
      } catch (error) {
        console.error('Error obteniendo perfil:', error);
      }
    };

    fetchPerfil();
  }, []);

  return (
    <div className="perfil-container">
      <NavBar />
      <aside className="sidebar">
        <h2>Mi cuenta</h2>
        <ul>
          <li><a href="/perfil">🧍Perfil</a></li>
          <li><a href="/reservas">🏷️ Mis reservas</a></li>
          <li><a href="/compras">🛒 Mis compras</a></li>
        </ul>
      </aside>

      <main className="perfil-main">
        {!perfil ? (
          <p>Cargando perfil...</p>
        ) : (
          <>
            <div className="perfil-header">
              <div className="perfil-avatar">
                {perfil.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h2>{perfil.name}</h2>
                <p>{perfil.email}</p>
              </div>
            </div>

            <div className="perfil-datos">
              <div className="perfil-dato"><strong>DNI:</strong> {perfil.dni || '---'}</div>
              <div className="perfil-dato"><strong>Nombre:</strong> {perfil.name || '---'}</div>
              <div className="perfil-dato"><strong>Email:</strong> {perfil.email || '---'}</div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Perfil;
