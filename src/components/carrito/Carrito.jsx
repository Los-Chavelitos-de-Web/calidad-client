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
    const carritoConCantidad = carritoGuardado.map((producto) => ({
      ...producto,
      cantidad: producto.cantidad || 1,
    }));
    setProductos(carritoConCantidad);
  }, []);

  const eliminarProducto = (index) => {
    const nuevosProductos = productos.filter((_, i) => i !== index);
    setProductos(nuevosProductos);
    localStorage.setItem("carrito", JSON.stringify(nuevosProductos));
    window.dispatchEvent(new Event("carritoActualizado"));
  };

  const actualizarCantidad = (index, nuevaCantidad) => {
    const nuevosProductos = [...productos];
    const cantidad = parseInt(nuevaCantidad, 10);
    nuevosProductos[index].cantidad =
      isNaN(cantidad) || cantidad < 1 ? 1 : cantidad;
    setProductos(nuevosProductos);
    localStorage.setItem("carrito", JSON.stringify(nuevosProductos));
    window.dispatchEvent(new Event("carritoActualizado"));
  };

  const total = productos
    .reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0)
    .toFixed(2);

  const cantidadTotal = productos.reduce(
    (acc, producto) => acc + producto.cantidad,
    0
  );

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
                <button onClick={() => eliminarProducto(index)}>
                  Eliminar
                </button>
              </div>

              <div className={styles.productoPrecio}>
                <div className={styles.cantidadBox}>
                  <label className={styles.cantidadLabel}>Cantidad:</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    className={styles.inputCantidad}
                    value={producto.cantidad}
                    onChange={(e) => {
                      const nuevaCantidad = e.target.value;
                      const nuevosProductos = [...productos];

                      // Permitimos vacío temporalmente mientras el usuario edita
                      if (nuevaCantidad === "") {
                        nuevosProductos[index].cantidad = "";
                      } else {
                        const cantidadNumerica = parseInt(nuevaCantidad, 10);
                        if (
                          !isNaN(cantidadNumerica) &&
                          cantidadNumerica <= 100
                        ) {
                          nuevosProductos[index].cantidad = cantidadNumerica;
                        }
                      }

                      setProductos(nuevosProductos);
                    }}
                    onBlur={(e) => {
                      let nuevaCantidad = parseInt(e.target.value, 10);
                      const nuevosProductos = [...productos];

                      // Validar límites
                      if (isNaN(nuevaCantidad) || nuevaCantidad < 1)
                        nuevaCantidad = 1;
                      if (nuevaCantidad > 100) nuevaCantidad = 100;

                      nuevosProductos[index].cantidad = nuevaCantidad;
                      setProductos(nuevosProductos);
                      localStorage.setItem(
                        "carrito",
                        JSON.stringify(nuevosProductos)
                      );
                      window.dispatchEvent(new Event("carritoActualizado"));
                    }}
                  />
                </div>
                <p>S/ {(producto.precio * producto.cantidad).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.resumenCompra}>
          <h4>Resumen de compra</h4>
          <p>
            Productos ({cantidadTotal}): <span>S/ {total}</span>
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
