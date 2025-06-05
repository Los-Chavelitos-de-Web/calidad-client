// NavBar.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { usePayload } from "../../utils/authHelpers"; // Asegúrate del path

import "./NavBar.css";

function getInitials(name = "") {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

const NavBar = () => {
  const navigate = useNavigate();
  const [cantidadCarrito, setCantidadCarrito] = useState(0);
  const [busqueda, setBusqueda] = useState("");
  const [historial, setHistorial] = useState([]);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [mostrarMenuUsuario, setMostrarMenuUsuario] = useState(false);

  const inputRef = useRef(null);
  const menuUsuarioRef = useRef(null);

  const { username, error, loading } = usePayload();

  useEffect(() => {
    const actualizarCantidad = () => {
      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      const totalCantidad = carrito.reduce(
        (acc, producto) => acc + (producto.quantity ?? producto.cantidad ?? 1),
        0
      );
      setCantidadCarrito(totalCantidad);
    };

    actualizarCantidad();
    window.addEventListener("carritoActualizado", actualizarCantidad);
    return () => window.removeEventListener("carritoActualizado", actualizarCantidad);
  }, []);

  useEffect(() => {
    const historialGuardado = JSON.parse(localStorage.getItem("historialBusqueda")) || [];
    setHistorial(historialGuardado);
  }, []);

  useEffect(() => {
    const manejarClickFuera = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setMostrarHistorial(false);
      }
      if (menuUsuarioRef.current && !menuUsuarioRef.current.contains(e.target)) {
        setMostrarMenuUsuario(false);
      }
    };
    document.addEventListener("mousedown", manejarClickFuera);
    return () => {
      document.removeEventListener("mousedown", manejarClickFuera);
    };
  }, []);

  const manejarBusqueda = (valorBusqueda) => {
  const termino = valorBusqueda?.trim() || busqueda.trim();
  if (termino !== "") {
    const historialActualizado = [termino, ...historial.filter((item) => item !== termino)].slice(0, 5);
    localStorage.setItem("historialBusqueda", JSON.stringify(historialActualizado));
    setHistorial(historialActualizado);
    navigate(`/buscar?query=${encodeURIComponent(termino)}`);
    setBusqueda("");
    setMostrarHistorial(false);
  }
};

  const cerrarSesion = () => {
    Cookies.remove("authToken");
    navigate("/login");
  };

  return (
    <div>
      <div className="top-bar">
        <div className="logo">
          <button onClick={() => navigate("/")} className="logo-button">
            <img src="/img/logo101.png" alt="Logo CRN" />
          </button>
        </div>

        <div className="search-bar" ref={inputRef}>
          <select><option>Todo</option></select>
          <input
            type="text"
            placeholder="Buscar ..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            onFocus={() => setMostrarHistorial(true)}
            onKeyDown={(e) => e.key === "Enter" && manejarBusqueda()}
          />
          <button onClick={manejarBusqueda}><img src="/img/lupa.png" alt="Buscar" /></button>
          {mostrarHistorial && historial.length > 0 && (
            <div className="historial-dropdown">
              {historial.map((item, index) => (
                <div key={index} className="item-historial" onClick={() => manejarBusqueda(item)}>
                  🕒 {item}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="icons">
          <div>
            {!loading && !error && username ? (
              <div className="usuario-logueado" ref={menuUsuarioRef}>
                <button onClick={() => setMostrarMenuUsuario(prev => !prev)} className="usuario-nombre">
                  <span className="avatar-usuario">{getInitials(username)}</span> -   
                   <span className="nombre-usuario">{username}</span> <img src="/icons/logueo.png" alt="Usuario" />
                </button>
                {mostrarMenuUsuario && (
                  <div className="usuario-menu">
                    <div className="usuario-header">
                      <span className="avatar-usuario-grande">{getInitials(username)}</span>
                      <div>
                        <strong>{username}</strong>
                        <div className="mi-perfil" onClick={() => navigate("/perfil")}>Mi perfil &gt;</div>
                      </div>
                    </div>
                    <div className="usuario-opciones">
                      
                      <button onClick={() => navigate("/compras")}>Mis compras</button>
                      <button onClick={() => navigate("/reservas")}>Mis reservas</button>
                      <button onClick={cerrarSesion}>Cerrar sesión</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => navigate("/login")} className="usuario-invitado">
                <img src="/img/usuario.png" alt="" /> ¡Bienvenido!
                <br />
                <small>Identifícate / Regístrate</small>
              </button>
            )}
          </div>

          <div className="cart">
            <button onClick={() => navigate("/Carrito")}>
              <img src="/img/carrito.png" alt="Carrito" />
              {cantidadCarrito > 0 && <span className="carrito-contador">{cantidadCarrito}</span>}
            </button>
          </div>
        </div>
      </div>

      <div className="menu-bar">
        <span>☰</span>
        <span>OFERTAS DEL DÍA</span>
        <span>PRODUCTOS</span>
        <span>NOSOTROS</span>
        <span>CONTACTANOS</span>
        <span>
          <button onClick={() => navigate("/admin")}>Admin</button>
        </span>
      </div>
    </div>
  );
};

export default NavBar;
