import React from 'react';
import './WhatsAppButton.css';
import logo from './whatsapp_logo.png'; // Estilos separados

const WhatsAppButton = () => {
  const phoneNumber = '51987654321'; // Reemplaza con tu número de WhatsApp real

  return (
    <a
      href={`https://wa.me/${phoneNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-button"
    >
      <img src={logo} alt="WhatsApp" />
    </a>
  );
};

export default WhatsAppButton;
