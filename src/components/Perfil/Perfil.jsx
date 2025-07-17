// src/components/Perfil/Perfil.jsx
import React, { useState, useEffect } from "react";
import NavBar from "../Nav/NavBar.jsx";
import { usePayload } from "../../utils/authHelpers";
import "./Perfil.css";

const Perfil = () => {
  const { username, email, dni, loading, error } = usePayload();

  const [editNombre, setEditNombre] = useState("");
  const [editDni, setEditDni] = useState("");
  const [editEmail, setEditEmail] = useState("");

  useEffect(() => {
    if (!loading && !error) {
      setEditNombre(username || "");
      setEditDni(dni || "");
      setEditEmail(email || "");
    }
  }, [username, dni, email, loading, error]);

  const handleActualizar = () => {
    // Aquí iría la lógica para enviar los datos al servidor (API call)
    console.log("Datos actualizados:", {
      nombre: editNombre,
      dni: editDni,
      email: editEmail,
    });
    alert("Datos actualizados (simulado)");
  };

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
            <input
              type="text"
              value={editDni}
              onChange={(e) => setEditDni(e.target.value)}
            />
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
        </div>

        <button className="btn-actualizar" onClick={handleActualizar}>
          Actualizar datos
        </button>
      </main>
    </div>
  );
};

export default Perfil;
