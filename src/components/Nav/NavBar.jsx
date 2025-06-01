import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => {
  const navigate = useNavigate();
  const [cantidadCarrito, setCantidadCarrito] = useState(0);

  useEffect(() => {
    const actualizarCantidad = () => {
      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      const totalCantidad = carrito.reduce(
        (acc, producto) => acc + (producto.cantidad || 1),
        0
      );
      setCantidadCarrito(totalCantidad);
    };
    
    actualizarCantidad(); //inicializa cantidad

    //escucha cambios del carrito desde otras partes de la app
    window.addEventListener("carritoActualizado", actualizarCantidad);

    return () => {
      window.removeEventListener("carritoActualizado", actualizarCantidad); //limpieza al icono carrito
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
          <div className="location">
            <img src="/img/ubi.png" alt="Ubicación" />
            <span style={{ color: "#ffffff", marginLeft: 8 }}>
              Enviar a Perú
            </span>
          </div>
        </div>

        <div className="search-bar">
          <select>
            <option>Todo</option>
          </select>
          <input type="text" placeholder="Buscar ..." />
          <button>
            <img src="/img/lupa.png" alt="Buscar" />
          </button>
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
              {/*contador si hay productos */}
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
