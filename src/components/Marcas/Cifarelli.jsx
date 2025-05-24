import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../Nav/NavBar";
import styles from "./Cifarelli.module.css";

const Cifarelli = () => {
  const [mostrarMas, setMostrarMas] = useState(false);
  const navigate = useNavigate();

  const productosIniciales = 4;
  const productosExtra = 8;

  const productosTotales = mostrarMas
    ? productosIniciales + productosExtra
    : productosIniciales;

  return (
    <div className={styles.fondoCifarelli}>
      <NavBar />

      {/* Flecha izquierda para ir a bonhoeffer */}
      <button
        className={styles.flechaIzquierda}
        onClick={() => navigate("/bonhoeffer")}
      >
        ←
      </button>

      <section className={styles.productosCifarelli}>
        <div className={styles.productosHeader}>
          <h2>PRODUCTOS</h2>
          <span className={styles.iconoFiltro}>⚙</span>
        </div>

        <div className={styles.productosGrid}>
          {Array(productosTotales)
            .fill(0)
            .map((_, index) => (
              <div className={styles.productoCard} key={index}>
                <div className={styles.imagenProducto}></div>
                <div className={styles.detalleProducto}>
                  <p className={styles.descripcion}>Lorem...</p>
                  <p className={styles.precio}>S/. 118.99</p>
                  <button className={styles.botonOpcion}>Reservar</button>
                </div>
              </div>
            ))}
        </div>

        <div className={styles.botonMostrarMasContainer}>
          <button
            className={styles.botonMostrarMas}
            onClick={() => setMostrarMas(!mostrarMas)}
          >
            {mostrarMas ? "↑ Mostrar menos" : "↓ Mostrar más"}
          </button>
        </div>
      </section>

      {/* Flecha derecha para ir a ducati */}
      <button
        className={styles.flechaDerecha}
        onClick={() => navigate("/ducati")}
      >
        →
      </button>
    </div>
  );
};

export default Cifarelli;
