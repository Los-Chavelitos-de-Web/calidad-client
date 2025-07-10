import React, { useEffect, useState } from "react";
import styles from "./CalificacionProducto.module.css";

const RatingDisplay = ({ productoId, refresh }) => {
  const [promedio, setPromedio] = useState(0); // Promedio de calificaciones
  const [cantidad, setCantidad] = useState(0); // Cantidad de calificaciones

  useEffect(() => {
    // Obtiene calificaciones desde localStorage
    const ratings = JSON.parse(localStorage.getItem("calificaciones")) || {};
    const califs = ratings[productoId] ? Object.values(ratings[productoId]) : [];

    const valores = califs.map((c) =>
      typeof c === "object" && c.valor ? c.valor : typeof c === "number" ? c : 0
    );

    // Calcula el total y promedio
    const total = valores.reduce((a, b) => a + b, 0);
    const promedio = valores.length ? (total / valores.length).toFixed(1) : 0;

    setPromedio(promedio); // Actualiza el promedio
    setCantidad(valores.length); // Actualiza la cantidad de calificaciones
  }, [productoId, refresh]); // Se actualiza cuando hay un cambio en el producto o se refresca

  return (
    <div className={styles.ratingResumen}>
      <div className={styles.promedio}>
        <span className={styles.ratingValor}>{promedio}</span>
        <div className={styles.estrellas}>
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={styles.estrella}
              style={{ color: i < Math.round(promedio) ? "#4285f4" : "#ccc" }}
            >
              ★
            </span>
          ))}
        </div>
        <span className={styles.totalCalificaciones}>
          ({cantidad}) calificaciones
        </span>
      </div>
    </div>
  );
};

export default RatingDisplay;
