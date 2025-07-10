import React, { useEffect, useState } from "react";
import styles from "./CalificacionProducto.module.css";

const RatingStats = ({ productoId, refresh }) => {
  // Estado que almacena cuántas calificaciones hay por cada valor (1 a 5 estrellas)
  const [estadisticas, setEstadisticas] = useState({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  });

  useEffect(() => {
    // Obtiene las calificaciones
    const ratings = JSON.parse(localStorage.getItem("calificaciones")) || {};
    const data = ratings[productoId] || {};

    const resumen = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    // Recorre las calificaciones y cuenta cuántas hay por cada valor
    Object.values(data).forEach((entry) => {
      const valor = entry?.valor;
      if (valor >= 1 && valor <= 5) {
        resumen[valor]++;
      }
    });
    setEstadisticas(resumen); // Actualiza el estado con las estadísticas
  }, [productoId, refresh]); // Se actualiza cuando hay un cambio en el producto o se refresca

  // Calcula el total de calificaciones para obtener el porcentaje
  const total = Object.values(estadisticas).reduce((a, b) => a + b, 0);

  return (
    <div className={styles.barrasEstrellas}>
      {[5, 4, 3, 2, 1].map((n) => {
        const cantidad = estadisticas[n];
        const porcentaje = total ? (cantidad / total) * 100 : 0;

        return (
          <div key={n} className={styles.filaEstrella}>
            <span>{n}</span>
            <div className={styles.barra}>
              <div
                className={styles.barraInterna}
                style={{
                  width: `${porcentaje}%`,
                  backgroundColor: porcentaje > 0 ? "#4285f4" : "#ccc",
                }}
              />
            </div>
            <span className={styles.estrellaGris}>★</span>
            <span className={styles.votoCantidad}>({cantidad})</span>
          </div>
        );
      })}
    </div>
  );
};

export default RatingStats;
