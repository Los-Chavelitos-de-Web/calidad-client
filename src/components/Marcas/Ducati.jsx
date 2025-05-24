import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../Nav/NavBar";
import styles from "./Ducati.module.css";

const Ducati = () => {
  const [mostrarMas, setMostrarMas] = useState(false);
  const navigate = useNavigate();

  const productosIniciales = 4;
  const productosExtra = 8;

  const productosTotales = mostrarMas
    ? productosIniciales + productosExtra
    : productosIniciales;

  return (
    <div className={styles.fondoDucati}>
      <NavBar />

      {/* Flecha izquierda para ir a cifarelli */}
      <button
        className={styles.flechaIzquierda}
        onClick={() => navigate("/cifarelli")}
      >
        ←
      </button>

      <section className={styles.productosDucati}>
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

      {/* Flecha derecha para ir a Honda */}
      <button
        className={styles.flechaDerecha}
        onClick={() => navigate("/Honda")}
      >
        →
      </button>
    </div>
  );
};

export default Ducati;
