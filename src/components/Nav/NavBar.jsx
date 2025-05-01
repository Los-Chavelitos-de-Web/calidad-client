import React from "react";
import "./NavBar.css";

const NavBar = () => (
  <div>
    <div className="top-bar">
      <div className="logo">
        <button className="logo-button">
        <img src="/public/img/logo101.png" alt="" />
        </button>
        <div className="location">
          <img src="./public/img/ubi.png" alt="" />
          <span>
            Enviar a Perú
          </span>
        </div>
      </div>

      <div className="search-bar">
        <select>
          <option>Todo</option>
        </select>
        <input type="text" placeholder="Buscar ..." />
        <button><img src="./public/img/lupa.png" alt="" /></button>
      </div>

      <div className="icons">
        <div>
          <a>
            <img src="./public/img/usuario.png" alt="" /> ¡Bienvenido!
            <br />
            <small>Identifícate / Regístrate</small>
          </a>
        </div>
        <div className="cart">
          <button>
            <img src="./public/img/carrito.png" alt="" />
          </button></div>
      </div>
    </div>

    <div className="menu-bar">
      <span className="menu-icon">☰</span>
      <span>OFERTAS DEL DÍA</span>
      <span>PRODUCTOS</span>
      <span>NOSOTROS</span>
      <span>CONTACTANOS</span>
    </div>
  </div>
);

export default NavBar;
