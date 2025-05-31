import React, { useEffect, useState } from "react";
import NavBar from "../Nav/NavBar";
import { useNavigate } from "react-router-dom";
import fondoCarrito from "../../assets/Fondo_Carrito/fondoCarrito.png";
import styles from "./Carrito.module.css";

const Carrito = () => {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
    setProductos(carritoGuardado);
  }, []);

  const eliminarProducto = (index) => {
    const nuevosProductos = productos.filter((_, i) => i !== index);
    setProductos(nuevosProductos);
    localStorage.setItem("carrito", JSON.stringify(nuevosProductos));
    window.dispatchEvent(new Event("carritoActualizado"));
  };

  const total = productos
    .reduce((acc, producto) => acc + producto.precio, 0)
    .toFixed(2);

  return (
    <div
          className={styles.fondoCarrito}
          style={{ backgroundImage: `url(${fondoCarrito})` }}
        >

      <NavBar />
      <div className={styles.carritoContainer}>
        <div className={styles.carritoProductos}>
          <h3>Productos seleccionados</h3>
          {productos.map((producto, index) => (
            <div className={styles.producto} key={index}>
              <img
                className={styles.productoImagen}
                src={producto.image || "https://via.placeholder.com/100"}
                alt={producto.title}
              />
              <div className={styles.productoDetalle}>
                <p className={styles.titulo}>{producto.title}</p>
                <button onClick={() => eliminarProducto(index)}>Eliminar</button>
              </div>
              <div className={styles.productoPrecio}>
                <p>S/ {producto.precio}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.resumenCompra}>
          <h4>Resumen de compra</h4>
          <p>
            Producto: <span>S/ {total}</span>
          </p>
          <p>
            Envío: <span className={styles.gratis}>Gratis</span>
          </p>
          <h3>
            Total: <span>S/ {total}</span>
          </h3>
          <button className={styles.btnComprar}>Continuar compra</button>
          <button className={styles.btnVolver} onClick={() => navigate(-1)}>
            ← Regresar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carrito;
