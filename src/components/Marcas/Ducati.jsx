import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../Nav/NavBar";
import styles from "./Ducati.module.css";
import BotonAñadir from "../carrito/BotonAñadir";
import fondoDucati from "../../assets/Fondos_Marcas/Ducati.png";

const Ducati = () => {
  const [mostrarMas, setMostrarMas] = useState(false);
  const [data, setData] = useState([]);  // Estado para almacenar los productos filtrados por marca
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Función para obtener los productos de la API
  const fetchData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACK}/products/getAll`
      );
      const result = await response.json();
      // Filtrarlos por marca "Ducati"
      const filteredData = result.filter(
        (product) => product.brand === "Ducati"
      )
      .map((product) => ({
        ...product,
        unit_price: product.unit_price ?? parseFloat((Math.random() * 800 + 200).toFixed(2)),
      }));
      //console.log(filteredData);
      setData(filteredData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(); // Llama a la función para obtener productos
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
                <div
                  className={styles.productoCard}
                  key={index}
                  onClick={() =>
                    navigate(`/producto/${producto.id}`, {
                      state: { producto },
                    })
                  }
                  style={{ cursor: "pointer" }}
                >
                  {/* Imagen del producto */}
                  <div className={styles.imagen}>
                    <img
                      src={producto.imageUrl}
                      alt={producto.title}
                      className={styles.productoImagen}
                    />
                  </div>

                  <div className={styles.detalleProducto}>
                    <p className={styles.descripcion}>{producto.title}</p>
                    <p className={styles.precio}>S/. {producto.unit_price}</p>

                    {/* Botón para añadir al carrito */}
                    <BotonAñadir producto={producto} />
                    
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
        onClick={() => navigate("/stihl")}
      >
        →
      </button>
    </div>
  );
};

export default Ducati;
