import React, { useState } from 'react';
import styles from './Registro.module.css';
import NavBar from '../Nav/NavBar';
import { useNavigate } from 'react-router-dom';

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'dni') {
      // Solo números y máximo 8 dígitos
      const onlyNumbers = value.replace(/\D/g, '');
      if (onlyNumbers.length <= 8) {
        setFormData({ ...formData, [name]: onlyNumbers });
      }
      return;
    }

    if (name === 'nombre' || name === 'apellido') {
      // Solo letras y espacios
      const onlyLetters = value.replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ\s]/g, '');
      setFormData({ ...formData, [name]: onlyLetters });
      return;
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      console.log('Respuesta del servidor:', data);

      if (response.ok) {
        alert('✅ Registro exitoso');
        navigate('/login');
      } else {
        setMensaje(data.message || '❌ Error al registrar');
      }
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      setMensaje('❌ Error de conexión con el servidor');
    }
  };

  return (
    <div>
      <NavBar />
      <div className={styles.loginContainer}>
        <div className={styles.loginBox}>
          <div className={styles.logoHeader}>
            <div className="cabecera">
              <h2>
                COMERCIAL <img src="/img/logo101 (1).png" alt="Logo" />
                <br />RAFAEL NORTE
              </h2>
              <p className={styles.subtitle}>Tu solución en Maquinaria Agrícola</p>
            </div>
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
              placeholder="Contraseña"
              className={styles.input}
              value={formData.password}
              onChange={handleChange}
              required
            />

            {mensaje && <p className={styles.error}>{mensaje}</p>}

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
    </div>
  );
};

export default Registro;
