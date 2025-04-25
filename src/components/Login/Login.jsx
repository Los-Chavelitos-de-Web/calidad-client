
import React from 'react';
import styles from './Login.module.css';

const Login = () => {
  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <div className={styles.logoHeader}>
          <div>
            <h2>COMERCIAL RAFAEL NORTE</h2>
            <p className={styles.subtitle}>Tu solución en Maquinaria Agrícola</p>
          </div>
        </div>
        <img src='./assets/img/logo101.png' alt="Logo" className={styles.logo} />
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
          <a href="#" className={styles.forgot}>
            ¿Olvidaste tu contraseña?
          </a>
          <button type="submit" className={styles.loginBtn}>
            Iniciar sesión
          </button>
        </form>
        <a href="#" className={styles.register}>
          Registrar cuenta
        </a>
      </div>
    </div>
  );
};

export default Login;
