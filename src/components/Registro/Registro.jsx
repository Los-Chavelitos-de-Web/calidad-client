
import React from 'react';
import styles from './Registro.module.css';
import NavBar from '../Nav/NavBar';
import { useNavigate } from 'react-router-dom';

const Registro = () => {
  const navigate = useNavigate();
  return (
    <div>
      <NavBar />
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <div className={styles.logoHeader}>
          <div className="cabecera">
            <h2 
    >COMERCIAL <img src='/public/img/logo101 (1).png'  />
              <br />RAFAEL NORTE</h2>
            <p className={styles.subtitle}>Tu solución en Maquinaria Agrícola</p>
          </div>
        </div>
        
        <form>
          <input
            type="text"
            placeholder="NOMBRE"
            className={styles.input}
            autoComplete="username"
          />
          <input
            type="text"
            placeholder="APELLIDO"
            className={styles.input}
            autoComplete="current-password"
          />
          <input
            type="number"
            placeholder="DNI"
            className={styles.input}
            autoComplete="current-password"
          />
          <input
            type="email"
            placeholder="EMAIL"
            className={styles.input}
            autoComplete="current-password"
          />
          <input
            type="number"
            placeholder="TELEFONO"
            className={styles.input}
            autoComplete="current-password"
          />
          <input
            type="password"
            placeholder="PASSWORD"
            className={styles.input}
            autoComplete="current-password"
          />
          <button type="submit" className={styles.loginBtn}>
            Registrar
          </button>
          <button onClick={() => navigate('/login')} className={styles.loginBtnV}>
            Volver
          </button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default Registro;
