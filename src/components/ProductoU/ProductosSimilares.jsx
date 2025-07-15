import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ProductosSimilares.module.css";

const ProductosSimilares = ({ categoria, idProductoActual, nombreBase }) => {
  const [similares, setSimilares] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  //Función para limpiar y separar texto en palabras clave sin tildes, mayúsculas ni signos
  const limpiarTexto = (texto) =>
    texto.toLowerCase().replace(/[^\w\s]/gi, "").split(" ");

  //Función para obtener productos similares desde la API
  const fetchSimilares = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BACK}/products/getAll`);
      const result = await response.json();

      //Convertimos el nombre del producto base en palabras clave
      const palabrasClave = limpiarTexto(nombreBase);

      //Filtramos productos similares
      const filtrados = result
        .filter((product) => {
          if (product.id === idProductoActual) return false;

          const mismaCategoria = product.category === categoria;

          // Combinamos título y descripción del producto para buscar coincidencias
          const textoProducto = `${product.title ?? ""} ${product.description ?? ""}`;
          const palabrasProducto = limpiarTexto(textoProducto);

          const coincidencia = palabrasClave.some((palabra) =>
            palabrasProducto.includes(palabra)
          );

          //Aceptar productos de la misma categoría o con coincidencia textual
          return mismaCategoria || coincidencia;
        })
        .map((product) => ({
          ...product,
          unit_price: product.unit_price ?? parseFloat((Math.random() * 800 + 200).toFixed(2)),
          brand: product.brand || "Marca genérica",
          model: product.model || "Modelo no especificado",
        }));

      setSimilares(filtrados.slice(0, 10)); // máximo 10 productos
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar productos similares:", error);
    }
  };

  //Cargar productos similares cuando cambie la categoría, el id o el nombre
  useEffect(() => {
    if (categoria && nombreBase) {
      fetchSimilares();
    }
  }, [categoria, idProductoActual, nombreBase]);

  return (
    <section className={styles.similaresSection}>
      <h2 className={styles.titulo}>Productos similares</h2>

      <div className={styles.similaresGrid}>
        {loading ? (
          <p>Cargando productos similares...</p>
        ) : similares.length === 0 ? (
          <p className={styles.mensajeVacio}>No se encontraron productos similares.</p>
        ) : (
          similares.map((producto, index) => (
            <div
              className={styles.card}
              key={index}
              onClick={() =>
                navigate(`/producto/${producto.id}`, {
                  state: { producto },
                })
              }
              style={{ cursor: "pointer" }}
            >
              <div className={styles.imagenProducto}>
                <img
                  src={producto.imageUrl}
                  alt={producto.title}
                />
              </div>
              <div className={styles.detalleProducto}>
                <p className={styles.descripcion}>{producto.title}</p>
                <p className={styles.precio}>S/. {producto.unit_price}</p>
                <p className={styles.marca}><strong>Marca:</strong> {producto.brand}</p>
                <p className={styles.modelo}><strong>Modelo:</strong> {producto.model}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default ProductosSimilares;
