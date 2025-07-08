// src/components/Calificaciones/RatingForm.jsx
import React, { useState, useEffect } from "react";
import { usePayload } from "../../utils/authHelpers";
import ComentarioItem from "./ComentarioItem";
import styles from "./CalificacionProducto.module.css";

const RatingForm = ({ productoId, onRated }) => {
  const [valor, setValor] = useState(0);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [comentario, setComentario] = useState("");
  const [enviado, setEnviado] = useState(false);
  const { email } = usePayload();
  const [comentarios, setComentarios] = useState([]);

  useEffect(() => {
    const guardadas = JSON.parse(localStorage.getItem("calificaciones")) || {};
    const datosProducto = guardadas[productoId] || {};

    if (email && datosProducto[email]) {
      setValor(datosProducto[email].valor || 0);
      setComentario(datosProducto[email].comentario || "");
      setEnviado(true);
    }

    const listaComentarios = Object.entries(datosProducto)
      .filter(([_, v]) => v.comentario?.trim())
      .map(([correo, { valor, comentario }]) => ({
        correo,
        valor,
        comentario,
      }));

    setComentarios(listaComentarios);
  }, [productoId, email]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || enviado || valor === 0) return;

    const trimmedComment = comentario.trim();
    if (trimmedComment && trimmedComment.length < 3) {
      alert("El comentario debe tener al menos 3 caracteres.");
      return;
    }

    const guardadas = JSON.parse(localStorage.getItem("calificaciones")) || {};
    guardadas[productoId] = guardadas[productoId] || {};
    guardadas[productoId][email] = { valor, comentario: trimmedComment };
    localStorage.setItem("calificaciones", JSON.stringify(guardadas));

    setEnviado(true);
    if (onRated) onRated();

    if (trimmedComment) {
      setComentarios((prev) => [
        ...prev,
        { correo: email, valor, comentario: trimmedComment },
      ]);
    }
  };

  return (
    <div className={styles.ratingContainer}>
      <div className={styles.formularioCalificacion}>
        {email ? (
          enviado ? (
            <p style={{ color: "#4285f4", marginTop: "10px" }}>
              Ya calificaste este producto. ¡Gracias!
            </p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className={styles.estrellas}>
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={styles.estrella}
                    onClick={() => setValor(i + 1)}
                    onMouseEnter={() => setHoverIndex(i + 1)}
                    onMouseLeave={() => setHoverIndex(null)}
                    style={{
                      cursor: "pointer",
                      color: i < (hoverIndex || valor) ? "#4285f4" : "#ccc",
                    }}
                    aria-label={`Calificar con ${i + 1} estrellas`}
                    role="button"
                  >
                    ★
                  </span>
                ))}
              </div>

              <textarea
                className={styles.textareaComentario}
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="(Opcional) Escribe un comentario..."
                rows={3}
              ></textarea>

              <button
                type="submit"
                className={styles.btnComentario}
                disabled={valor === 0}
              >
                Enviar calificación
              </button>
            </form>
          )
        ) : (
          <p style={{ color: "#888", fontSize: "0.9rem" }}>
            Inicia sesión para calificar este producto.
          </p>
        )}
      </div>

      <div className={styles.listaComentarios}>
        <h4 className={styles.tituloComentarios}>Comentarios recientes</h4>
        {comentarios.length === 0 ? (
          <p style={{ color: "#888" }}>Aún no hay comentarios.</p>
        ) : (
          comentarios.map((c, i) => <ComentarioItem key={i} {...c} />)
        )}
      </div>
    </div>
  );
};

export default RatingForm;
