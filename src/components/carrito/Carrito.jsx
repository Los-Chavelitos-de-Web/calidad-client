import React, { useEffect, useState } from "react";
import NavBar from "../Nav/NavBar";
import { useNavigate } from "react-router-dom";
import fondoCarrito from "../../assets/Fondo_Carrito/fondoCarrito.png";
import styles from "./Carrito.module.css";

const Carrito = () => {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  // Función para obtener el stock total
  const getStock = (stockData) => {
    if (!stockData) return 0;
    return typeof stockData === "object"
      ? Object.values(stockData).reduce((sum, val) => sum + (val || 0), 0)
      : stockData;
  };

  // Al montar el componente, carga el carrito desde localStorage
  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
    const hoy = new Date().toISOString();

    const carritoConDatos = carritoGuardado.map((producto) => ({
      id: producto.id,
      title: producto.title,
      description: producto.description || "Sin descripción.",
      brand: producto.brand || "Marca genérica",
      unit_price: producto.unit_price || producto.precio || 0,
      stock: producto.stock || 100,
      quantity: producto.quantity || producto.cantidad || 1,
      image: producto.image || "https://via.placeholder.com/100",
      createdAt: producto.createdAt || hoy,
    }));

    setProductos(carritoConDatos);
  }, []);

  // Elimina un producto del carrito, actualiza estado y localStorage
  const eliminarProducto = (index) => {
    const nuevosProductos = productos.filter((_, i) => i !== index);
    setProductos(nuevosProductos);
    localStorage.setItem("carrito", JSON.stringify(nuevosProductos));
    window.dispatchEvent(new Event("carritoActualizado"));
  };

  // Actualiza la cantidad de un producto validando el valor
  const actualizarCantidad = (index, nuevaCantidad) => {
    const nuevosProductos = [...productos];
    const cantidad = parseInt(nuevaCantidad, 10);
    nuevosProductos[index].quantity =
      isNaN(cantidad) || cantidad < 1 ? 1 : cantidad;
    setProductos(nuevosProductos);
    localStorage.setItem("carrito", JSON.stringify(nuevosProductos));
    window.dispatchEvent(new Event("carritoActualizado"));
  };

  // Calcula el total del carrito y la cantidad total de productos
  const total = productos
    .reduce((acc, producto) => acc + producto.unit_price * producto.quantity, 0)
    .toFixed(2);

  const cantidadTotal = productos.reduce(
    (acc, producto) => acc + producto.quantity,
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
          {productos.map((producto, index) => {
            const stockDisponible = getStock(producto.stock);

            return (
              <div className={styles.producto} key={index}>
                <img
                  className={styles.productoImagen}
                  src={producto.image}
                  alt={producto.title}
                />
                <div className={styles.productoDetalle}>
                  <p className={styles.titulo}>{producto.title}</p>
                  <p className={styles.descripcion}>{producto.description}</p>
                  <p className={styles.marca}>Marca: {producto.brand}</p>
                  <p className={styles.stock}>
                    Stock:{" "}
                    <span
                      className={`${styles.stockValue} ${
                        stockDisponible === 0 ? styles.sinStock : ""
                      }`}
                    >
                      {stockDisponible === 0 ? "Sin stock" : stockDisponible}
                    </span>
                  </p>
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
                      max={stockDisponible || 100}
                      className={styles.inputCantidad}
                      value={producto.quantity}
                      onChange={(e) => {
                        const nuevaCantidad = e.target.value;
                        const nuevosProductos = [...productos];

                        if (nuevaCantidad === "") {
                          // No permitir borrar el valor, mantener cantidad actual
                          return;
                        }

                        const cantidadNumerica = parseInt(nuevaCantidad, 10);
                        if (
                          !isNaN(cantidadNumerica) &&
                          cantidadNumerica >= 1 &&
                          cantidadNumerica <= stockDisponible
                        ) {
                          nuevosProductos[index].quantity = cantidadNumerica;
                          setProductos(nuevosProductos);
                          localStorage.setItem(
                            "carrito",
                            JSON.stringify(nuevosProductos)
                          );
                          window.dispatchEvent(new Event("carritoActualizado"));
                        }
                      }}
                      onBlur={(e) => {
                        let nuevaCantidad = parseInt(e.target.value, 10);
                        const nuevosProductos = [...productos];

                        if (isNaN(nuevaCantidad) || nuevaCantidad < 1)
                          nuevaCantidad = 1;
                        if (nuevaCantidad > stockDisponible)
                          nuevaCantidad = stockDisponible;

                        nuevosProductos[index].quantity = nuevaCantidad;
                        setProductos(nuevosProductos);
                        localStorage.setItem(
                          "carrito",
                          JSON.stringify(nuevosProductos)
                        );
                        window.dispatchEvent(new Event("carritoActualizado"));
                      }}
                      onKeyDown={(e) => {
                        // Permitir solo flechas arriba y abajo para cambiar valor
                        if (e.key !== "ArrowUp" && e.key !== "ArrowDown") {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e) => {
                        // Evitar pegar texto
                        e.preventDefault();
                      }}
                    />
                  </div>
                  {/* Precio total por producto */}
                  <p>S/ {(producto.unit_price * producto.quantity).toFixed(2)}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Resumen de compra */}
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
