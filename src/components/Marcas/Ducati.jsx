import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../Nav/NavBar";
import styles from "./Ducati.module.css";
import fondoDucati from "../../assets/Fondos_Marcas/Ducati.png";

const Ducati = () => {
  const [mostrarMas, setMostrarMas] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACK}/products/getAll`
      );
      const result = await response.json();
      const filteredData = result.filter(
        (product) => product.brand === "Ducati"
      );
      //console.log(filteredData);
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
      className={styles.fondoDucati}
      style={{ backgroundImage: `url(${fondoDucati})` }}
    >
      <NavBar />

      {/* Flecha izquierda para ir a Cifarelli */}
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
                    <p className={styles.precio}>
                      S/. {Math.round(Math.random() * 200)}
                    </p>

                    <button
                      className={styles.botonOpcion}
                      onClick={() => {
                        const carritoActual =
                          JSON.parse(localStorage.getItem("carrito")) || [];

                        const productoExistente = carritoActual.find(
                          (item) => item.id === producto.id
                        );

                        if (productoExistente) {
                          // Si el producto ya existe, incrementa la cantidad
                          const carritoActualizado = carritoActual.map((item) =>
                            item.id === producto.id
                              ? { ...item, cantidad: (item.cantidad || 1) + 1 }
                              : item
                          );
                          localStorage.setItem(
                            "carrito",
                            JSON.stringify(carritoActualizado)
                          );
                        } else {
                          // Si no existe, agrégalo con cantidad 1
                          const productoAgregado = {
                            ...producto,
                            precio: Math.round(Math.random() * 200),
                            cantidad: 1,
                          };
                          localStorage.setItem(
                            "carrito",
                            JSON.stringify([...carritoActual, productoAgregado])
                          );
                        }

                        // Notificar que se actualizó el carrito
                        window.dispatchEvent(new Event("carritoActualizado"));
                      }}
                    >
                      Reservar
                    </button>
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

      {/* Flecha derecha para ir a Honda */}
      <button
        className={styles.flechaDerecha}
        onClick={() => navigate("/honda")}
      >
        →
      </button>
    </div>
  );
};

export default Ducati;
