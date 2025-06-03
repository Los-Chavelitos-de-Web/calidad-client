import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => {
  const navigate = useNavigate();
  const [cantidadCarrito, setCantidadCarrito] = useState(0);
  const [busqueda, setBusqueda] = useState("");
  const [historial, setHistorial] = useState([]);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const inputRef = useRef(null);

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

  return () => {
    window.removeEventListener("carritoActualizado", actualizarCantidad);
  };
}, []);



  useEffect(() => {
    const historialGuardado =
      JSON.parse(localStorage.getItem("historialBusqueda")) || [];
    setHistorial(historialGuardado);
  }, []);

  const manejarBusqueda = () => {
    if (busqueda.trim() !== "") {
      const nuevaBusqueda = busqueda.trim();
      const historialActualizado = [nuevaBusqueda, ...historial.filter((item) => item !== nuevaBusqueda)].slice(0, 5);
      localStorage.setItem(
        "historialBusqueda",
        JSON.stringify(historialActualizado)
      );
      setHistorial(historialActualizado);
      navigate(`/buscar?query=${encodeURIComponent(nuevaBusqueda)}`);
      setBusqueda(""); // Limpiar input después de buscar
      setMostrarHistorial(false);
    }
  };

  const seleccionarHistorial = (item) => {
    setBusqueda(item);
    setMostrarHistorial(false);
    navigate(`/buscar?query=${encodeURIComponent(item)}`);
  };

  useEffect(() => {
    const manejarClickFuera = (e) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setMostrarHistorial(false);
      }
    };

    document.addEventListener("mousedown", manejarClickFuera);
    return () => {
      document.removeEventListener("mousedown", manejarClickFuera);
    };
  }, []);

  return (
    <div>
      <div className="top-bar">
        <div className="logo">
          {/* Botón del logo que redirige al home */}
          <button
            className="logo-button"
            onClick={() => navigate("/")}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
            aria-label="Ir al inicio"
          >
            <img src="/img/logo101.png" alt="Logo CRN" />
          </button>
        </div>

        <div className="search-bar" ref={inputRef}>
          <select>
            <option>Todo</option>
          </select>
          <input
            type="text"
            placeholder="Buscar ..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            onFocus={() => setMostrarHistorial(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                manejarBusqueda();
              }
            }}
          />
          <button onClick={manejarBusqueda}>
            <img src="/img/lupa.png" alt="Buscar" />
          </button>

          {/* Mostrar historial */}
          {mostrarHistorial && historial.length > 0 && (
            <div className="historial-dropdown">
              {historial.map((item, index) => (
                <div
                  key={index}
                  className="item-historial"
                  onClick={() => seleccionarHistorial(item)}
                >
                  <span className="icono-historial" aria-hidden="true">🕒</span> {item}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="icons">
          <div>
            <a
              onClick={() => navigate("/Login")}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
            >
              <img src="/img/usuario.png" alt="" /> ¡Bienvenido!
              <br />
              <small>Identifícate / Regístrate</small>
            </a>
          </div>
          <div className="cart">
            <a
              onClick={() => navigate("/Carrito")}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                position: "relative",
              }}
            >
              <img src="/img/carrito.png" alt="Carrito" />
              {/* contador si hay productos */}
              {cantidadCarrito > 0 && (
                <span className="carrito-contador">{cantidadCarrito}</span>
              )}
            </a>
          </div>
        </div>
      </div>

      <div className="menu-bar">
        <span className="menu-icon">☰</span>
        <span>OFERTAS DEL DÍA</span>
        <span>PRODUCTOS</span>
        <span>NOSOTROS</span>
        <span>CONTACTANOS</span>
        <span>
          <a
            onClick={() => navigate("/admin")}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
          >
            Admin
          </a>
        </span>
      </div>
    </div>
  );
};

export default NavBar;