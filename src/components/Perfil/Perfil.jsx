// src/components/Perfil/Perfil.jsx
import React, { useState, useEffect } from "react";
import NavBar from "../Nav/NavBar.jsx";
import { usePayload } from "../../utils/authHelpers";
import "./Perfil.css";

const Perfil = () => {
  const { userId, username, email, dni, role, loading, error } = usePayload();

  const [editNombre, setEditNombre] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [dniValue, setDniValue] = useState("");

  const [actualizando, setActualizando] = useState(false);
    // Retrieve authToken from localStorage (or your preferred method)
    const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchDni = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`${import.meta.env.VITE_APP_BACK}/users/profile/${userId}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        const data = await response.json();
        setDniValue(data.dni || "");
      } catch (err) {
        console.error("Error al obtener el DNI:", err);
      }
    }

    fetchDni();
  });

  useEffect(() => {
    if (!loading && !error) {
      setEditNombre(username || "");
      setEditEmail(email || "");
      setDniValue(dni || "");
    }
  }, [username, dni, email, loading, error]);

  const handleActualizar = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editEmail)) {
      alert("El correo no tiene un formato válido.");
      return;
    }

    if (!userId) {
      alert("No se pudo obtener el ID del usuario.");
      return;
    }

    setActualizando(true);


    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BACK}/users/update/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: editNombre,
          email: editEmail,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar los datos.");
      }

      const data = await response.json();
      alert("Datos actualizados correctamente.");
      console.log("Respuesta del servidor:", data);
    } catch (err) {
      console.error(err);
      alert("Hubo un problema al actualizar los datos.");
    } finally {
      setActualizando(false);
    }
  };

  const datosModificados = editNombre !== username || editEmail !== email;

  if (loading) return <p>Cargando perfil...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="perfil-container">
      <NavBar />

      <aside className="sidebar">
        <h2>Mi cuenta</h2>
        <ul>
          <li><a href="/perfil">🧍 Perfil</a></li>
          <li><a href="/reservas">🏷️ Mis reservas</a></li>
          <li><a href="/compras">🛒 Mis compras</a></li>
        </ul>
      </aside>

      <main className="perfil-main">
        <div className="perfil-header">
          <div className="perfil-avatar">
            {username?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h2>{username}</h2>
            <p>{email}</p>
          </div>
        </div>

        <div className="perfil-datos">
          <div className="perfil-dato">
            <strong>DNI:</strong>
            <span>{dniValue}</span>
          </div>
          <div className="perfil-dato">
            <strong>Nombre:</strong>
            <input
              type="text"
              value={editNombre}
              onChange={(e) => setEditNombre(e.target.value)}
            />
          </div>
          <div className="perfil-dato">
            <strong>Email:</strong>
            <input
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
            />
          </div>
          {role !== "CLIENTE" && (
            <div className="perfil-dato">
              <strong>Rol:</strong>
              <span>{role}</span>
            </div>
          )}
        </div>

        <button
          className="btn-actualizar"
          onClick={handleActualizar}
          disabled={!datosModificados || actualizando}
        >
          {actualizando ? "Actualizando..." : "Actualizar datos"}
        </button>
      </main>
    </div>
  );
};

export default Perfil;
