import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../Nav/NavBar";
import styles from "./Honda.module.css";
import fondoHonda from "../../assets/Fondos_Marcas/Honda.png";

const Honda = () => {
  const [mostrarMas, setMostrarMas] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BACK}/products/getAll`);
      const result = await response.json();
      const filteredData = result.filter(product => product.brand === "Honda");
      console.log(filteredData);
      setData(filteredData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div
      className={styles.fondoHonda}
      style={{ backgroundImage: `url(${fondoHonda})` }}
    >
      <NavBar />

      <section className={styles.productosHonda}>
        <div className={styles.productosHeader}>
          <h2>PRODUCTOS</h2>
          <span className={styles.iconoFiltro}>⚙</span>
        </div>

        <div className={styles.productosGrid}>
          {loading ? (
            <h1>cargando...</h1>
          ) : (
            data
              .slice(0, mostrarMas ? data.length : 4)
              .map((producto, index) => (
                <div className={styles.productoCard} key={index}>
                  <div className={styles.imagenProducto}></div>
                  <div className={styles.detalleProducto}>
                    <p className={styles.descripcion}>{producto.title}</p>
                    <p className={styles.precio}>S/. {Math.round(Math.random() * 200)}</p>
                    <button className={styles.botonOpcion}>Reservar</button>
                  </div>
                </div>
              ))
          )}
        </div>

        <div className={styles.botonMostrarMasContainer}>
          {data.length > 4 && (
            <button
              className={styles.botonMostrarMas}
              onClick={() => setMostrarMas(!mostrarMas)}
            >
              {mostrarMas ? "↑ Mostrar menos" : "↓ Mostrar más"}
            </button>
          )}
        </div>
      </section>

      <button
        className={styles.flechaDerecha}
        onClick={() => navigate("/rato")}
      >
        →
      </button>
    </div>
  );
};

export default Honda;
