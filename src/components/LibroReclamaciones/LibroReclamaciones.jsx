import React, { useState } from "react";
import NavBar from "../Nav/NavBar";
import styles from "./LibroReclamaciones.module.css";
import { usePayload } from "../../utils/authHelpers";

const LibroReclamaciones = () => {
  const { userId, username, email, loading, error } = usePayload();

  const [formData, setFormData] = useState({
    tipo: "",
    descripcion: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId || userId < 1) {
      alert("❌ No se puede enviar la reclamación. Usuario no válido.");
      return;
    }

    const payloadData = {
      userId,
      title: formData.tipo,
      description: formData.descripcion,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACK}/libro-reclamaciones`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payloadData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error en la respuesta:", response.status, errorText);
        alert("❌ Error al enviar la reclamación.");
        return;
      }

      alert("✅ Reclamación enviada con éxito.");
      setFormData({ tipo: "", descripcion: "" });
    } catch (error) {
      console.error("🚨 Error de red:", error);
      alert("❌ Error de red al enviar la reclamación.");
    }
  };

  if (loading) {
    return (
      <p className={styles.mensajeCarga}>⏳ Cargando datos del usuario...</p>
    );
  }

  if (error || !userId) {
    return (
      <p className={styles.mensajeError}>
        ⚠️ Usuario no válido. Por favor, inicia sesión.
      </p>
    );
  }

  return (
    <>
      <NavBar />
      <div className={styles.libroContainer}>
        <div className={styles.libroReclamaciones}>
          <h2 className={styles.titulo}>Libro de Reclamaciones</h2>

          <p className={styles.infoUsuario}>
            🧍 <strong>{username}</strong>
            <br />
            📧 <strong>{email}</strong>
          </p>

          <form className={styles.formulario} onSubmit={handleSubmit}>
            <div className={styles.campo}>
              <label className={styles.etiqueta}>
                📝 Tipo de reclamo
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  required
                  className={styles.input}
                >
                  <option value="">Seleccione una opción</option>
                  <option value="Consulta">Consulta</option>
                  <option value="Queja">Queja</option>
                  <option value="Reclamo">Reclamo</option>
                  <option value="Sugerencia">Sugerencia</option>
                </select>
              </label>
            </div>

            <div className={styles.campo}>
              <label className={styles.etiqueta}>
                💬 Descripción
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  required
                  className={styles.textarea}
                  placeholder="Describe con claridad tu reclamo o sugerencia..."
                />
              </label>
            </div>

            <button type="submit" className={styles.boton}>
              🚀 Enviar Reclamación
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LibroReclamaciones;
