import React, { useState } from 'react';
import styles from './Login.module.css';
import NavBar from '../Nav/NavBar';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ModalError = ({ mensaje, onClose }) => {
  if (!mensaje) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <p className={styles.modalText}>{mensaje}</p>
        <button onClick={onClose} className={styles.modalButton}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'email' && value.length > 254) return;
    if (name === 'password' && value.length > 8) return;

    setForm({ ...form, [name]: value });
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
        Cookies.set('authToken', data.token, { expires: 1 });
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
              maxLength={254}
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
              maxLength={8}
              required
            />
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

      {mensaje && <ModalError mensaje={mensaje} onClose={() => setMensaje('')} />}
    </div>
  );
};

export default Login;
