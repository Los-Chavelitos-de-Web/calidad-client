import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../Nav/NavBar";
import BotonAñadir from "../carrito/BotonAñadir";
import styles from "./ProductoU.module.css";
import ProductosSimilares from "./ProductosSimilares";
import CalificacionProducto from "../CalificarProducto/CalificacionProducto";

const ProductoU = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const [promedioCalificacion, setPromedioCalificacion] = useState(0);
  const [cantidadCalificaciones, setCantidadCalificaciones] = useState(0);

  // estado para forzar actualización
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  //Función que se llama al calificar un producto
  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    // Al cambiar de producto, se vuelve al inicio
    window.scrollTo({ top: 0, behavior: "smooth" });
    setProducto(null);
    const fetchProducto = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_BACK}/products/${id}`
        );
        const encontrado = await response.json();

        if (encontrado) {
          const precioAleatorio = Math.round(Math.random() * 200);
          const stockTotal =
            typeof encontrado.stock === "object"
              ? Object.values(encontrado.stock).reduce((a, b) => a + b, 0)
              : encontrado.stock;

          setProducto({
            id: encontrado.id,
            title: encontrado.title,
            description: encontrado.description || "Sin descripción.",
            brand: encontrado.brand || "Marca genérica",
            unit_price: encontrado.price || precioAleatorio,
            stock: stockTotal ?? 0,
            model: encontrado.model || "No especificado",
            category: encontrado.category || "Sin categoría",
            image: encontrado.imageUrl || "/images/no-image.png",
          });
        } else {
          console.error("Producto no encontrado.");
        }
      } catch (error) {
        console.error("Error al obtener el producto:", error);
      }
    };

    fetchProducto();
  }, [id]);

  // Actualiza promedio y cantidad de calificaciones si hay cambio
  useEffect(() => {
    if (!id) return;

    const guardadas = JSON.parse(localStorage.getItem("calificaciones")) || {};
    const productoCalif = guardadas[id];

    // Si no hay calificaciones, se inicializa como un objeto vacío
    if (productoCalif) {
      const valores = Object.values(productoCalif).map((c) =>
        typeof c === "object" && c.valor
          ? c.valor
          : typeof c === "number"
          ? c
          : 0
      );

      const total = valores.reduce((a, b) => a + b, 0);
      const promedio = valores.length ? total / valores.length : 0;

      setPromedioCalificacion(promedio.toFixed(1));
      setCantidadCalificaciones(valores.length);
    } else {
      setPromedioCalificacion(0);
      setCantidadCalificaciones(0);
    }
  }, [producto, refreshTrigger]); // se actualiza cuando alguien califica

  if (!producto) {
    return <h2 className={styles.cargando}>Cargando producto...</h2>;
  }

  return (
    <div className={styles.fondo}>
      <NavBar />
      <div className={styles.wrapper}>
        <div className={styles.imagenContainer}>
          <img src={producto.image} alt={producto.title} />
        </div>
        <div className={styles.infoContainer}>
          <table className={styles.tablaDatos}>
            <tbody>
              <tr>
                <td className={styles.productName} colSpan={2}>
                  {producto.title}
                  {/*  Calificaciones visuales */}
                  <div className={styles.estrellas}>
                    {[...Array(5)].map((_, index) => (
                      <span
                        key={index}
                        className={styles.estrella}
                        style={{
                          color:
                            index < Math.round(promedioCalificacion)
                              ? "#4285f4"
                              : "#ccc",
                        }}
                      >
                        ★
                      </span>
                    ))}
                    <span className={styles.calificacionesCantidad}>
                      ({cantidadCalificaciones}) calificaciones
                    </span>
                  </div>
                </td>
              </tr>
              <tr>
                <td><strong>Precio:</strong></td>
                <td>S/ {producto.unit_price}</td>
              </tr>
              <tr>
                <td><strong>Marca:</strong></td>
                <td>{producto.brand}</td>
              </tr>
              <tr>
                <td><strong>Stock:</strong></td>
                <td>{producto.stock}</td>
              </tr>
              <tr>
                <td><strong>Modelo:</strong></td>
                <td>{producto.model}</td>
              </tr>
              <tr>
                <td><strong>Categoría:</strong></td>
                <td>{producto.category}</td>
              </tr>
              <tr>
                <td><strong>Descripción:</strong></td>
                <td>{producto.description}</td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <div className={styles.botonContainer} style={{ position: "relative" }}>
                    <BotonAñadir
                      producto={producto}
                      onAdded={() => {
                        setShowToast(true);
                        setTimeout(() => setShowToast(false), 3000);
                      }}
                    />
                    {showToast && (
                      <div className={styles.toast}>
                        <span className={styles.icon}>✅</span> Producto añadido al carrito
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Calificación del producto */}
      <CalificacionProducto
        productoId={producto.id}
        onRefresh={handleRefresh}
      />

      {/* Productos similares */}
      <ProductosSimilares
        categoria={producto.category}
        idProductoActual={producto.id}
        nombreBase={producto.title}
      />
    </div>
  );
};

export default ProductoU;