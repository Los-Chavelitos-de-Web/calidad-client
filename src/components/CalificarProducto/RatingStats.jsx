import React, { useEffect, useState } from "react";
import styles from "./CalificacionProducto.module.css";

const RatingStats = ({ productoId, refresh }) => {
  const [estadisticas, setEstadisticas] = useState({});

  useEffect(() => {
    const ratings = JSON.parse(localStorage.getItem("calificaciones")) || {};
    const data = ratings[productoId] || {};
    const valores = Object.values(data).map((c) => c.valor);
    const resumen = [5, 4, 3, 2, 1].reduce((acc, val) => {
      acc[val] = valores.filter((v) => v === val).length;
      return acc;
    }, {});
    setEstadisticas(resumen);
  }, [productoId, refresh]);

  const total = Object.values(estadisticas).reduce((a, b) => a + b, 0);

  return (
    <div className={styles.barrasEstrellas}>
      {[5, 4, 3, 2, 1].map((n) => {
        const porcentaje = total ? (estadisticas[n] / total) * 100 : 0;
        return (
          <div key={n} className={styles.filaEstrella}>
            <span>{n}</span>
            <div className={styles.barra}>
              <div
                className={styles.barraInterna}
                style={{ width: `${porcentaje}%` }}
              ></div>
            </div>
            <span className={styles.estrellaGris}>★</span>
          </div>
        );
      })}
    </div>
  );
};

export default RatingStats;
