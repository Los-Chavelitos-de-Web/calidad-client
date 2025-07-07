import React, { useEffect, useState } from 'react';
import './Compras.css';
import NavBar from '../Nav/NavBar';
import { jwtDecode } from 'jwt-decode';


const getMonthName = (fechaStr) => {
  const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  const date = new Date(fechaStr);
  return meses[date.getMonth()];
};

const Compras = () => {
  const [compras, setCompras] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [mesFiltro, setMesFiltro] = useState('todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token no encontrado');
          return;
        }

        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const response = await fetch(`http://localhost:3000/api/v1/reservas/items/${userId}`);
        const data = await response.json();
        setCompras(data);
      } catch (error) {
        console.error('Error al obtener las compras:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompras();
  }, []);

  const comprasFiltradas = compras.filter((compra) => {
    const productoMatch = compra.producto?.toLowerCase().includes(busqueda.toLowerCase()) || '';
    const codigoMatch = compra.codigo_producto?.toLowerCase().includes(busqueda.toLowerCase()) || '';
    const mes = getMonthName(compra.fecha);
    const coincideMes = mesFiltro === 'todos' || mes === mesFiltro;

    return (productoMatch || codigoMatch) && coincideMes;
  });

  return (
    <div className="compras-container">
      <NavBar />
      <aside className="sidebar">
        <h2>Mi cuenta</h2>
        <ul>
          <li><a href="/perfil">🧍Perfil</a></li>
          <li><a href="/reservas">🏷️ Mis reservas</a></li>
          <li><a href="/compras">🛒 Mis compras</a></li>
        </ul>
      </aside>
      <div className="compras-content">
        <h1>Compras</h1>

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
          <p>Cargando compras...</p>
        ) : comprasFiltradas.length === 0 ? (
          <p>No se encontraron compras con esos filtros.</p>
        ) : (
          comprasFiltradas.map((compra) => (
            <div className="compra-card" key={compra.id}>
              <p className="reserva-fecha">
                {new Date(compra.fecha).toLocaleDateString('es-PE', {
                  day: '2-digit', month: 'long', year: 'numeric'
                })}
              </p>
              <div className="compra-detalle">
                <div className="compra-img">
                  <div className="img-placeholder">🛒</div>
                </div>
                <div className="compra-info">
                  <span className="estado-confirmada">Confirmada</span>
                  <h3>Código: {compra.codigo_producto}</h3>
                  <p className="producto">{compra.producto}</p>
                  <p className="color">Cantidad: {compra.cantidad}</p>
                  <p className="color">Precio Base: S/. {parseFloat(compra.precio_base).toFixed(2)}</p>
                  <p className="color">Código Sunat: {compra.codigo_sunat}</p>
                </div>
                <div className="compra-actions">
                  <p className="tienda">Compra ID: {compra.saleId}</p>
                  <button className="btn-ver">Ver detalle</button>
                  <button className="btn-repetir">Repetir compra</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Compras;
