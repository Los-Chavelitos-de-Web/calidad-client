import React, { useState, useEffect } from "react";
import { usePayload } from "../../utils/authHelpers";
import styles from "./CalificacionProducto.module.css";

const RatingForm = ({ productoId, onRated }) => {
  const [valor, setValor] = useState(0);
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

    const guardadas = JSON.parse(localStorage.getItem("calificaciones")) || {};
    guardadas[productoId] = guardadas[productoId] || {};
    guardadas[productoId][email] = { valor, comentario: comentario.trim() };
    localStorage.setItem("calificaciones", JSON.stringify(guardadas));

    setEnviado(true);
    if (onRated) onRated();

    if (comentario.trim()) {
      setComentarios((prev) => [
        ...prev,
        { correo: email, valor, comentario: comentario.trim() },
      ]);
    }
  };

  return (
    <div className={styles.ratingContainer}>
      {/* IZQUIERDA: Estrellas y formulario */}
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
                    style={{
                      cursor: "pointer",
                      color: i < valor ? "#4285f4" : "#ccc",
                    }}
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

      {/* DERECHA: Comentarios */}
      <div className={styles.listaComentarios}>
        <h4 className={styles.tituloComentarios}>Comentarios recientes</h4>
        {comentarios.length === 0 ? (
          <p style={{ color: "#888" }}>Aún no hay comentarios.</p>
        ) : (
          comentarios.map((c, i) => (
            <div key={i} className={styles.comentario}>
              <div className={styles.comentarioEstrellas}>
                {[...Array(5)].map((_, j) => (
                  <span
                    key={j}
                    className={styles.estrella}
                    style={{
                      color: j < c.valor ? "#4285f4" : "#ccc",
                      fontSize: "18px",
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className={styles.textoComentario}>{c.comentario}</p>
              <p className={styles.correoComentario}>
                <i>{c.correo}</i>
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RatingForm;
