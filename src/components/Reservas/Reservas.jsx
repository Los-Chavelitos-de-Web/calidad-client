import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import './Reservas.css';
import NavBar from '../Nav/NavBar';

const getMonthName = (fechaStr) => {
  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
    'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const date = new Date(fechaStr);
  return meses[date.getMonth()];
};

const Reservas = () => {
  const [reservas, setReservas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [mesFiltro, setMesFiltro] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservasUsuario = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error("No se encontró el token. Asegúrate de estar logueado.");
        }

        const decoded = jwtDecode(token);
        const userId = decoded.id || decoded.user_id || decoded.sub;

        if (!userId) {
          throw new Error("No se pudo extraer el ID del usuario del token.");
        }

        const response = await fetch(`http://localhost:3000/api/v1/reservas/items/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener las reservas del usuario.");
        }

        const data = await response.json();
        setReservas(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReservasUsuario();
  }, []);

  const reservasFiltradas = reservas.filter((reserva) => {
    const productoMatch = reserva.producto?.toLowerCase().includes(busqueda.toLowerCase()) || '';
    const codigoMatch = reserva.codigo_producto?.toLowerCase().includes(busqueda.toLowerCase()) || '';
    const mes = getMonthName(reserva.fecha);
    const coincideMes = mesFiltro === 'todos' || mes === mesFiltro;

    return (productoMatch || codigoMatch) && coincideMes;
  });

  return (
    <div className="reservas-container">
      <NavBar />
      <aside className="sidebar">
        <h2>Mi cuenta</h2>
        <ul>
          <li><a href="/perfil">🧍Perfil</a></li>
          <li><a href="/reservas">🏷️ Mis reservas</a></li>
          <li><a href="/compras">🛒 Mis compras</a></li>
        </ul>
      </aside>
      <div className="reservas-content">
        <h1>Mis Reservas</h1>

        <div className="filtros">
          <input
            type="text"
            placeholder="Buscar por producto o código"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <select value={mesFiltro} onChange={(e) => setMesFiltro(e.target.value)}>
            <option value="todos">Todos los meses</option>
            <option value="enero">Enero</option>
            <option value="febrero">Febrero</option>
            <option value="marzo">Marzo</option>
            <option value="abril">Abril</option>
            <option value="mayo">Mayo</option>
            <option value="junio">Junio</option>
            <option value="julio">Julio</option>
            <option value="agosto">Agosto</option>
            <option value="septiembre">Septiembre</option>
            <option value="octubre">Octubre</option>
            <option value="noviembre">Noviembre</option>
            <option value="diciembre">Diciembre</option>
          </select>
        </div>

        {loading ? (
          <p>Cargando tus reservas...</p>
        ) : error ? (
          <p className="error">Error: {error}</p>
        ) : reservasFiltradas.length === 0 ? (
          <p>No se encontraron reservas con esos filtros.</p>
        ) : (
          reservasFiltradas.map((reserva) => (
            <div className="reserva-card" key={reserva.id}>
              <p className="reserva-fecha">
                {new Date(reserva.fecha).toLocaleDateString('es-PE', {
                  day: '2-digit', month: 'long', year: 'numeric'
                })}
              </p>
              <div className="reserva-detalle">
                <div className="reserva-img">
                  <div className="img-placeholder">📦</div>
                </div>
                <div className="reserva-info">
                  <span className="estado-confirmada">Confirmada</span>
                  <h3>Código: {reserva.codigo_producto}</h3>
                  <p className="producto">{reserva.producto}</p>
                  <p className="color">Cantidad: {reserva.cantidad}</p>
                  <p className="color">Precio Base: S/. {reserva.precio_base.toFixed(2)}</p>
                </div>
                <div className="reserva-actions">
                  <p className="tienda">Reserva ID: {reserva.reservaId}</p>
                  <button className="btn-ver">Ver reserva</button>
                  <button className="btn-repetir">Repetir reserva</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reservas;
