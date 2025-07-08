import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../Nav/NavBar";
import styles from "./Buscar.module.css";

const Buscar = () => {
  const [productosOriginales, setProductosOriginales] = useState([]); // Todos los productos obtenidos
  const [resultados, setResultados] = useState([]); // Productos filtrados y ordenados para mostrar
  const [loading, setLoading] = useState(true); // Estado de carga
  const [orden, setOrden] = useState("ninguno"); // Criterio de ordenamiento
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_BACK}/products/getAll`
        );
        const productos = await response.json();

        const productosConPrecios = productos.map((p) => ({
          ...p,
          precio: p.precio ?? Math.round(Math.random() * 200),
        }));

        setProductosOriginales(productosConPrecios);
        filtrarYOrdenar(productosConPrecios, query, orden); // Filtrar y ordenar con los datos cargados
        setLoading(false);
      } catch (error) {
        console.error("Error al buscar:", error);
      }
    };

    if (query) fetchData();
  }, [query]);

  // Filtrar productos por texto y ordenar según selección
  const filtrarYOrdenar = (productos, texto, ordenSeleccionado) => {
    const textoMin = texto.toLowerCase();
    let filtrados = productos.filter(
      (producto) =>
        producto.title.toLowerCase().includes(textoMin) ||
        (producto.brand && producto.brand.toLowerCase().includes(textoMin))
    );

    if (ordenSeleccionado === "menor") {
      filtrados.sort((a, b) => a.precio - b.precio);
    } else if (ordenSeleccionado === "mayor") {
      filtrados.sort((a, b) => b.precio - a.precio);
    }

    setResultados(filtrados);
  };

  // Cambia el criterio de orden y actualiza resultados
  const handleOrdenChange = (e) => {
    const nuevoOrden = e.target.value;
    setOrden(nuevoOrden);
    filtrarYOrdenar(productosOriginales, query, nuevoOrden);
  };

  // Navega a la página del producto seleccionado
  const handleClickProducto = (id) => {
    navigate(`/producto/${id}`);
  };

  return (
    <div className={styles.fondoBuscar}>
      <NavBar />
      <section className={styles.contenedorResultados}>
        <div className={styles.encabezado}>
          <h2 className={styles.titulo}>Resultados para: "{query}"</h2>
          <div className={styles.ordenar}>
            <label htmlFor="orden">Ordenar por:</label>
            <select id="orden" value={orden} onChange={handleOrdenChange}>
              <option value="ninguno">Seleccionar</option>
              <option value="menor">Menor precio</option>
              <option value="mayor">Mayor precio</option>
            </select>
          </div>
        </div>

        {loading ? (
          <h1>Cargando...</h1>
        ) : resultados.length === 0 ? (
          <p>No se encontraron productos.</p>
        ) : (
          resultados.map((producto, index) => (
            <div
              className={styles.productoFila}
              key={index}
              onClick={() => handleClickProducto(producto.id)}
              style={{ cursor: "pointer" }}
            >
              <div className={styles.imagenContenedor}>
                <img src={producto.imageUrl} alt={producto.title} />
              </div>
              <div className={styles.infoContenedor}>
                <p className={styles.nombreProducto}>{producto.title}</p>
                <p className={styles.precioProducto}>S/ {producto.precio}</p>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default Buscar;
