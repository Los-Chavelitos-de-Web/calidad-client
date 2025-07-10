import React, { useState } from "react";
import NavBar from "../Nav/NavBar";
import styles from "./LibroReclamaciones.module.css";
import { usePayload } from "../../utils/authHelpers"; // Importa el hook usePayload para obtener datos del usuario

const LibroReclamaciones = () => {
  // Extraemos información del usuario desde el token JWT
  const { userId, username, email, loading, error } = usePayload();

  // Estado para manejar los datos del formulario
  const [formData, setFormData] = useState({
    tipo: "",
    descripcion: "",
  });

  // Función para manejar los cambios en los campos del formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación del usuario, asegurarse que el userId es válido antes de enviar
    if (!userId || userId < 1) {
      alert("❌ No se puede enviar la reclamación. Usuario no válido.");
      return;
    }

    // Preparamos el objeto que será enviado al backend
    const payloadData = {
      userId,
      title: formData.tipo,
      description: formData.descripcion,
    };

    try {
      // Enviamos la reclamación al backend
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

      // Verificamos si la respuesta es exitosa
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error en la respuesta:", response.status, errorText);
        alert("❌ Error al enviar la reclamación.");
        return;
      }

      // Si todo sale bien, mostramos un mensaje de éxito
      alert("✅ Reclamación enviada con éxito.");
      setFormData({ tipo: "", descripcion: "" });
    } catch (error) {
      // Si ocurre un error de red u otro problema
      console.error("🚨 Error de red:", error);
      alert("❌ Error de red al enviar la reclamación.");
    }
  };

  // Si el usuario no está cargando, mostramos un mensaje de carga o error
  if (loading) {
    return (
      <p className={styles.mensajeCarga}>⏳ Cargando datos del usuario...</p>
    );
  }

   // Si hay error o el usuario no es válido, se muestra un mensaje
  if (error || !userId) {
    return (
      <p className={styles.mensajeError}>
        ⚠️ Usuario no válido. Por favor, inicia sesión.
      </p>
    );
  }

  // Interfaz del formulario
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
