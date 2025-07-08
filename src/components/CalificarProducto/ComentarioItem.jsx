// src/components/Calificaciones/ComentarioItem.jsx
import React from "react";
import styles from "./CalificacionProducto.module.css";

const ComentarioItem = ({ correo, valor, comentario }) => (
  <div className={styles.comentario}>
    <div className={styles.comentarioEstrellas}>
      {[...Array(5)].map((_, j) => (
        <span
          key={j}
          className={styles.estrella}
          style={{
            color: j < valor ? "#4285f4" : "#ccc",
            fontSize: "18px",
          }}
        >
          ★
        </span>
      ))}
    </div>
    <p className={styles.textoComentario}>{comentario}</p>
    <p className={styles.correoComentario}>
      <i>{correo}</i>
    </p>
  </div>
);

export default ComentarioItem;
