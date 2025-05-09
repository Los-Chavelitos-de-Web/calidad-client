
import React from 'react';
import styles from './Login.module.css';
import NavBar from '../Nav/NavBar';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const navigate = useNavigate();
  return (
    <div>
      <NavBar />
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <div className={styles.logoHeader}>
          <div className="cabecera">
            <h2>COMERCIAL <img src='/public/img/logo101 (1).png'  />
              <br />RAFAEL NORTE</h2>
            <p className={styles.subtitle}>Tu solución en Maquinaria Agrícola</p>
          </div>
        </div>
        
        <form>
          <input
            type="text"
            placeholder="USUARIO"
            className={styles.input}
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="PASSWORD"
            className={styles.input}
            autoComplete="current-password"
          />
          <button type="submit" className={styles.loginBtn}>
            Iniciar sesión
          </button>
        </form>
        <a onClick={() => navigate('/registro')}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
          Registrar cuenta
        </a>
      </div>
    </div>
    </div>
  );
};

export default Login;
