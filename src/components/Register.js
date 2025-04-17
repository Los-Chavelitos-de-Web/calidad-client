import React from 'react';
import './Auth.css';

function Register() {
  return (
    <div className="auth-container">
      <h2>Bienvenidos<br /><span className="brand">AIRCLOCK</span></h2>
      <input type="text" placeholder="NOMBRE" className="auth-input" />
      <input type="text" placeholder="APELLIDOS" className="auth-input" />
      <input type="text" placeholder="TELEFONO" className="auth-input" />
      <input type="email" placeholder="EMAIL" className="auth-input" />
      <input type="password" placeholder="PASSWORD" className="auth-input" />
      <button className="auth-button">REGISTRAR</button>
    </div>
  );
}

export default Register;
