// src/components/Perfil/Perfil.jsx
import React from "react";
import NavBar from "../Nav/NavBar.jsx";
import { usePayload } from "../../utils/authHelpers";
import "./Perfil.css";

const Perfil = () => {
  const { username, email, dni, loading, error } = usePayload();

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
          <div className="perfil-dato"><strong>DNI:</strong> {dni || "No disponible"}</div>
          <div className="perfil-dato"><strong>Nombre:</strong> {username}</div>
          <div className="perfil-dato"><strong>Email:</strong> {email}</div>
        </div>
      </main>
    </div>
  );
};

export default Perfil;
