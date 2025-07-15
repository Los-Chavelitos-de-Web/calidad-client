import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../Nav/NavBar";
import BotonAñadir from "../carrito/BotonAñadir";
import styles from "./Productos.module.css";

const Productos = () => {
  // Estado para guardar todos los productos obtenidos del backend
  const [data, setData] = useState([]);
  // Estado para filtrar por marca
  const [filtroMarca, setFiltroMarca] = useState("Todas");
  // Estado para el orden de precio (ascendente o descendente)
  const [ordenPrecio, setOrdenPrecio] = useState(null);
  // Estado para controlar la paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 12; // Cantidad de productos por página
  const navigate = useNavigate();

   // Al cargar el componente, obtenemos los productos del backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_APP_BACK}/products/getAll`);
        const productos = await res.json();
        // Asegura que todos los productos tengan un precio asignado
        const datosProcesados = productos.map((p) => ({
          ...p,
          unit_price: p.unit_price ?? parseFloat((Math.random() * 800 + 200).toFixed(2)),
        }));
        setData(datosProcesados);
      } catch (err) {
        console.error("Error cargando productos:", err);
      }
    };
    fetchData();
  }, []);

  // Obtener las marcas únicas para el filtro
  const marcas = ["Todas", ...new Set(data.map((p) => p.brand))];

    // Aplica filtro por marca y ordena por precio si corresponde
  const productosFiltrados = (filtroMarca === "Todas"
    ? data
    : data.filter((p) => p.brand === filtroMarca)
  ).sort((a, b) => {
    if (ordenPrecio === "asc") return a.unit_price - b.unit_price;
    if (ordenPrecio === "desc") return b.unit_price - a.unit_price;
    return 0; // Sin ordenamiento
  });

  // Lógica de paginación
  const indiceInicial = (paginaActual - 1) * productosPorPagina;
  const indiceFinal = indiceInicial + productosPorPagina;
  // Obtener los productos que se mostrarán en la página actual
  const productosEnPagina = productosFiltrados.slice(indiceInicial, indiceFinal);
  // Calcular el total de páginas
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

  // Función para cambiar de página
  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  return (
    <div className={styles.fondoProductos}>
      <NavBar />
      <div className={styles.layoutGeneral}>
        <aside className={styles.filtro}>
          {/* Filtro por marca */}
          <h3 className={styles.filtroTitulo}>Filtrar por marca</h3>
          <ul className={styles.listaMarcas}>
            {marcas.map((marca, idx) => (
              <li
                key={idx}
                className={`${styles.itemMarca} ${filtroMarca === marca ? styles.activo : ""}`}
                onClick={() => {
                  setFiltroMarca(marca); // Aplica el filtro
                  setPaginaActual(1);   // Reinicia la paginación
                }}
              >
                {marca}
              </li>
            ))}
          </ul>

          {/* Orden por precio */}
          <h3 className={styles.filtroTitulo}>Ordenar por precio</h3>
          <ul className={styles.listaMarcas}>
            <li
              className={`${styles.itemMarca} ${ordenPrecio === "asc" ? styles.activo : ""}`}
              onClick={() => setOrdenPrecio("asc")}
            >
              Menor a mayor
            </li>
            <li
              className={`${styles.itemMarca} ${ordenPrecio === "desc" ? styles.activo : ""}`}
              onClick={() => setOrdenPrecio("desc")}
            >
              Mayor a menor
            </li>
          </ul>
        </aside>

        {/* CONTENEDOR DE PRODUCTOS */}
        <div className={styles.container}>
          <h2 className={styles.tituloProductos}>Catálogo de Productos</h2>

          {/* Mensaje si no hay productos */}
          {productosFiltrados.length === 0 ? (
            <p className={styles.mensaje}>No hay productos disponibles.</p>
          ) : (
            <div className={styles.gridProductos}>
              {/* Tarjetas de productos */}
              {productosEnPagina.map((producto) => (
                <div
                  key={producto.id}
                  className={styles.cardProducto}
                  onClick={() =>
                    navigate(`/producto/${producto.id}`, { state: { producto } })
                  }
                >
                  <div className={styles.imagenProducto}>
                    <img
                      src={producto.imageUrl}
                      alt={producto.title}
                    />
                  </div>

                  <div className={styles.detalleProducto}>
                    <p className={styles.nombre}>{producto.title}</p>
                    <p className={styles.precio}>S/. {producto.unit_price}</p>
                    <p className={styles.marca}>
                      <strong>Marca:</strong> {producto.brand}
                    </p>
                    <p className={styles.modelo}>
                      <strong>Modelo:</strong> {producto.model}
                    </p>
                  </div>

                  {/* Botón para añadir al carrito */}
                  <BotonAñadir producto={producto} />
                </div>
              ))}
            </div>
          )}

          {/* Controles de paginación */}
          {totalPaginas > 1 && (
            <div className={styles.paginacion}>
              <button onClick={() => cambiarPagina(paginaActual - 1)} disabled={paginaActual === 1}>
                ← Anterior
              </button>
              <span>Página {paginaActual} de {totalPaginas}</span>
              <button onClick={() => cambiarPagina(paginaActual + 1)} disabled={paginaActual === totalPaginas}>
                Siguiente →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Productos;
