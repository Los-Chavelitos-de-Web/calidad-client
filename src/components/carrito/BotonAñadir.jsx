
import React from "react";
import styles from "./BotonAñadir.module.css";

const BotonAñadir = ({ producto, onAdded = () => {} }) => {
  const handleAddToCart = (e) => {
    e.stopPropagation();

    const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];

    const productoExistente = carritoActual.find(
      (item) => item.id === producto.id
    );

    if (productoExistente) {
      const carritoActualizado = carritoActual.map((item) =>
        item.id === producto.id
          ? {
              ...item,
              quantity: (item.quantity || item.cantidad || 1) + 1,
            }
          : item
      );
      localStorage.setItem("carrito", JSON.stringify(carritoActualizado));
    } else {
      const productoAgregado = {
        ...producto,
        quantity: 1,
      };
      localStorage.setItem(
        "carrito",
        JSON.stringify([...carritoActual, productoAgregado])
      );
    }

    window.dispatchEvent(new Event("carritoActualizado"));
    onAdded(); // Llamar callback opcional
  };

  return (
    <button className={styles.botonOpcion} onClick={handleAddToCart}>
      Añadir al carrito
    </button>
  );
};

export default BotonAñadir;
