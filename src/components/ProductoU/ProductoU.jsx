import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../Nav/NavBar";
import styles from "./ProductoU.module.css";

const ProductoU = () => {
  const { id } = useParams(); // Obtener el id del producto desde la URL
  const [producto, setProducto] = useState(null); // Estado para almacenar el producto cargado
  const [showToast, setShowToast] = useState(false); // Estado para mostrar mensaje temporal al añadir al carrito

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_BACK}/products/getAll`);
        const data = await response.json();

        // Buscar el producto que coincide con el id
        const encontrado = data.find((p) => p.id === Number(id));

        if (encontrado) {
          const precioAleatorio = Math.floor(Math.random() * (2000 - 500 + 1)) + 500;

          const stockTotal =
            typeof encontrado.stock === "object"
              ? Object.values(encontrado.stock).reduce((a, b) => a + b, 0)
              : encontrado.stock;

          // Guardar producto con valores por defecto si faltan datos
          setProducto({
            id: encontrado.id,
            title: encontrado.title,
            description: encontrado.description || "Sin descripción.",
            brand: encontrado.brand || "Marca genérica",
            unit_price: encontrado.price || precioAleatorio,
            stock: stockTotal ?? 0,
            model: encontrado.model || "No especificado",
            category: encontrado.category || "Sin categoría",
            image: encontrado.image || "https://via.placeholder.com/200",
          });
        }
      } catch (error) {
        console.error("Error al obtener el producto:", error);
      }
    };

    fetchProducto();
  }, [id]);

  // Función para agregar producto al carrito almacenado en localStorage
  const agregarAlCarrito = () => {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];

    // Verificar si el producto ya está en el carrito para aumentar cantidad
    const indexProducto = carritoGuardado.findIndex((p) => p.id === producto.id);
    if (indexProducto !== -1) {
      carritoGuardado[indexProducto].quantity =
        (carritoGuardado[indexProducto].quantity || 1) + 1;
    } else {
      carritoGuardado.push({ ...producto, quantity: 1 }); // Añadir producto nuevo con cantidad 1
    }

    localStorage.setItem("carrito", JSON.stringify(carritoGuardado));

    // Mostrar toast confirmando que se agregó al carrito y ocultarlo luego de 3 segundos
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    // Disparar evento global para notificar otros componentes que carrito cambió
    window.dispatchEvent(new Event("carritoActualizado"));
  };

  if (!producto) {
    return <h2 className={styles.cargando}>Cargando producto...</h2>; // Mostrar mientras se carga producto
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
              {/* Mostrar todos los detalles del producto */}
              <tr>
                <td className={styles.productName} colSpan={2}>
                  {producto.title}
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
                  <div className={styles.botonContainer} style={{ position: 'relative' }}>
                    {/* Botón para añadir al carrito */}
                    <button className={styles.boton} onClick={agregarAlCarrito}>
                      Añadir al carrito
                    </button>

                    {/* Toast que aparece temporalmente al añadir producto */}
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
    </div>
  );
};

export default ProductoU;
