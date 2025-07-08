import React, { useState } from "react";
import RatingDisplay from "./RatingDisplay";
import RatingForm from "./RatingForm";
import RatingStats from "./RatingStats";
import styles from "./CalificacionProducto.module.css";

const CalificacionProducto = ({ productoId, onRefresh }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Llamado cuando alguien califica
  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
    if (onRefresh) onRefresh(); // 🔁 informa al padre (ProductoU)
  };

  return (
    <div className={styles.opinionesContainer}>
      <h2 className={styles.opinionesTitulo}>Opiniones del producto</h2>
      <RatingDisplay productoId={productoId} refresh={refreshTrigger} />
      <RatingForm productoId={productoId} onRated={handleRefresh} />
      <RatingStats productoId={productoId} refresh={refreshTrigger} />
    </div>
  );
};

export default CalificacionProducto;
