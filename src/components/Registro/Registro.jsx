/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import styles from './Registro.module.css';
import NavBar from '../Nav/NavBar';
import { useNavigate } from 'react-router-dom';

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

const Registro = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    email: '',
    password: ''
  });

  const [mensaje, setMensaje] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    hasLetters: false,
    hasUppercase: false,
    hasNumbers: false,
    hasSpecialChars: false,
  });

  const evaluatePassword = (password) => {
    const length = password.length >= 8 && password.length <= 20;
    const hasLetters = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const passed = [length, hasLetters, hasUppercase, hasNumbers, hasSpecialChars].filter(Boolean).length;

    let strength = 'Débil';
    if (passed >= 4) strength = 'Media';
    if (passed === 5) strength = 'Fuerte';

    setPasswordCriteria({ length, hasLetters, hasUppercase, hasNumbers, hasSpecialChars });
    setPasswordStrength(strength);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'dni') {
      const onlyNumbers = value.replace(/\D/g, '');
      if (onlyNumbers.length <= 8) {
        setFormData({ ...formData, [name]: onlyNumbers });
      }
      return;
    }

    if (name === 'nombre' || name === 'apellido') {
      const onlyLetters = value.replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ\s]/g, '');
      if (onlyLetters.length <= 50) {
        setFormData({ ...formData, [name]: onlyLetters });
      }
      return;
    }

    if (name === 'email') {
      if (value.length <= 254) {
        setFormData({ ...formData, [name]: value });
      }
      return;
    }

    if (name === 'password') {
      if (value.length <= 20) {
        setFormData({ ...formData, [name]: value });
        evaluatePassword(value);
      }
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

   // if (!formData.email.endsWith('@gmail.com')) {
     // setMensaje('❌ Solo se permiten correos @gmail.com');
      //return;
    //}

    if (formData.password.length < 8) {
      setMensaje('❌ La contraseña debe tener al menos 8 caracteres');
      return;
    }

    const nombreCompleto = `${formData.nombre.trim()} ${formData.apellido.trim()}`.trim();

    const dataToSend = {
      name: nombreCompleto,
      dni: formData.dni.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACK}/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend),
        }
      );
      const data = await response.json();

      if (response.ok) {
        alert('✅ Registro exitoso');
        navigate('/login');
      } else {
        setMensaje(data.message || '❌ Error al registrar');
      }
    } catch (error) {
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
              type="text"
              name="nombre"
              placeholder="Nombre"
              className={styles.input}
              value={formData.nombre}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="apellido"
              placeholder="Apellido"
              className={styles.input}
              value={formData.apellido}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="dni"
              placeholder="DNI"
              className={styles.input}
              value={formData.dni}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={styles.input}
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña (8-20 caracteres)"
              className={styles.input}
              value={formData.password}
              onChange={handleChange}
              required
              maxLength={20}
            />

            <div>
              <div className={styles.passwordStrengthBar}>
                <div
                  style={{
                    height: '8px',
                    width: passwordStrength === 'Débil' ? '33%' :
                          passwordStrength === 'Media' ? '66%' : '100%',
                    backgroundColor: passwordStrength === 'Débil' ? 'red' :
                                     passwordStrength === 'Media' ? 'orange' : 'green',
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
              <p>Seguridad: <strong>{passwordStrength}</strong></p>
              <ul className={styles.passwordChecklist}>
                <li style={{ color: passwordCriteria.length ? 'green' : 'gray' }}>
                  Entre 8 y 20 caracteres
                </li>
                <li
                  style={{
                    color:
                      passwordCriteria.hasLetters &&
                      passwordCriteria.hasUppercase &&
                      passwordCriteria.hasNumbers &&
                      passwordCriteria.hasSpecialChars
                        ? 'green'
                        : 'gray',
                  }}
                >
                  Letras, may, números y caracteres especiales
                </li>
              </ul>
            </div>

            <button type="submit" className={styles.loginBtn}>
              Registrar
            </button>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className={styles.loginBtnV}
            >
              Volver
            </button>
          </form>
        </div>
      </div>

      {mensaje && <ModalError mensaje={mensaje} onClose={() => setMensaje('')} />}
    </div>
  );
};

export default Registro;
