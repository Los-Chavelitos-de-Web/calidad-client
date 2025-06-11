import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../Nav/NavBar";
import styles from "./ProductoU.module.css";

const ProductoU = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        console.log("ID:", id);

        const response = await fetch(
          `${import.meta.env.VITE_APP_BACK}/products/${id}`
        );
        const encontrado = await response.json(); // 🔄 Ya es un objeto, no uses .find

        if (encontrado) {
          const precioAleatorio =
            Math.round(Math.random() * 200);

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
            image: encontrado.image || "/images/no-image.png",
          });
        } else {
          console.error("Producto no encontrado.");
        }
      } catch (error) {
        console.error("Error al obtener el producto:", error);
      }
    };

    fetchProducto();
  }, [id]); // ✅ Asegúrate de incluir id como dependencia

  const agregarAlCarrito = () => {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
    const indexProducto = carritoGuardado.findIndex(
      (p) => p.id === producto.id
    );

    if (indexProducto !== -1) {
      carritoGuardado[indexProducto].quantity =
        (carritoGuardado[indexProducto].quantity || 1) + 1;
    } else {
      carritoGuardado.push({ ...producto, quantity: 1 });
    }

    localStorage.setItem("carrito", JSON.stringify(carritoGuardado));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    window.dispatchEvent(new Event("carritoActualizado"));
  };

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
                  <div className={styles.estrellas}>
                    {[...Array(5)].map((_, index) => (
                      <span key={index} className={styles.estrella}>
                        ★
                      </span>
                    ))}
                    <span className={styles.calificacionesCantidad}>
                      (#cantidad)
                    </span>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Precio:</strong>
                </td>
                <td>S/ {producto.unit_price}</td>
              </tr>
              <tr>
                <td>
                  <strong>Marca:</strong>
                </td>
                <td>{producto.brand}</td>
              </tr>
              <tr>
                <td>
                  <strong>Stock:</strong>
                </td>
                <td>{producto.stock}</td>
              </tr>
              <tr>
                <td>
                  <strong>Modelo:</strong>
                </td>
                <td>{producto.model}</td>
              </tr>
              <tr>
                <td>
                  <strong>Categoría:</strong>
                </td>
                <td>{producto.category}</td>
              </tr>
              <tr>
                <td>
                  <strong>Descripción:</strong>
                </td>
                <td>{producto.description}</td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <div
                    className={styles.botonContainer}
                    style={{ position: "relative" }}
                  >
                    <button className={styles.boton} onClick={agregarAlCarrito}>
                      Añadir al carrito
                    </button>
                    {showToast && (
                      <div className={styles.toast}>
                        <span className={styles.icon}>✅</span> Producto añadido
                        al carrito
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/*CALIFICACION DEL PRODUCTO*/}
      <div className={styles.opinionesContainer}>
        <h2 className={styles.opinionesTitulo}>Opiniones del producto</h2>
        <div className={styles.ratingResumen}>
          <div className={styles.promedio}>
            <span className={styles.ratingValor}>4.9</span>
            <div className={styles.estrellas}>
              {[...Array(5)].map((_, index) => (
                <span key={index} className={styles.estrella}>
                  ★
                </span>
              ))}
            </div>
            <span className={styles.totalCalificaciones}>
              (#) calificaciones
            </span>
          </div>

          <div className={styles.barrasEstrellas}>
            {[5, 4, 3, 2, 1].map((estrella) => (
              <div key={estrella} className={styles.filaEstrella}>
                <span>{estrella}</span>
                <div className={styles.barra}>
                  <div
                    className={styles.barraInterna}
                    style={{
                      width:
                        estrella === 5
                          ? "80%"
                          : estrella === 4
                          ? "15%"
                          : estrella === 3
                          ? "5%"
                          : estrella === 2
                          ? "0%"
                          : "0%",
                    }}
                  ></div>
                </div>
                <span className={styles.estrellaGris}>★</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductoU;
