import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Login() {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <h2>Bienvenidos<br /><span className="brand">AIRCLOCK</span></h2>
      <input type="text" placeholder="USUARIO" className="auth-input" />
      <input type="password" placeholder="PASSWORD" className="auth-input" />
      <p className="forgot">¿Olvidaste tu contraseña?</p>
      <button className="auth-button">Iniciar sesión</button>
      <p className="create" onClick={() => navigate('/register')} style={{ cursor: 'pointer' }}>Crear cuenta</p>
    </div>
  );
}

export default Login;