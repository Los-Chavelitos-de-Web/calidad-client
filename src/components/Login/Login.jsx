// Login.jsx
import React, { useState } from 'react';
import styles from './Login.module.css';
import NavBar from '../Nav/NavBar';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BACK}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        Cookies.set('authToken', data.token, { expires: 1 }); // 1 día
        navigate('/');
      } else {
        setMensaje(data.message || '❌ Usuario o contraseña incorrectos');
      }
    } catch {
      setMensaje('❌ Error de conexión con el servidor');
    }
  };

  return (
    <div>
      <NavBar />
      <div className={styles.loginContainer}>
        <div className={styles.loginBox}>
          <div className={styles.logoHeader}>
            <h2>
              COMERCIAL <img src="/img/logo101 (1).png" alt="Logo" />
              <br />RAFAEL NORTE
            </h2>
            <p className={styles.subtitle}>Tu solución en Maquinaria Agrícola</p>
          </div>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="USUARIO"
              className={styles.input}
              value={form.email}
              onChange={handleChange}
              autoComplete="username"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="PASSWORD"
              className={styles.input}
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
            {mensaje && <p className={styles.error}>{mensaje}</p>}
            <button type="submit" className={styles.loginBtn}>
              Iniciar sesión
            </button>
          </form>
          <a
            onClick={() => navigate('/registro')}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            Registrar cuenta
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
