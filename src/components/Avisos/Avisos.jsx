import React from 'react';
import './Avisos.css';

const avisos = [
  {
    titulo: 'Envío Seguro',
    descripcion: 'Envío seguro en productos seleccionados',
    imagen: '/icons/delivery.png',
  },
  {
    titulo: 'Servicio Técnico',
    descripcion: 'Ofrecemos servicio técnico de calidad a todos los clientes',
    imagen: '/icons/servicio tecnico.png',
  },
  {
    titulo: 'Atención 24/7',
    descripcion: 'Atención 24/7 WhatsApp 918 698 741',
    imagen: '/icons/atencion.png',
  },
  {
    titulo: 'Pago Seguro',
    descripcion: 'Su información de pago se procesa de forma segura',
    imagen: '/icons/pago-seguro.png',
  },
];

const Avisos = () => {
  return (
    <section className="avisos">
      <div className="avisos-grid">
        {avisos.map((aviso, index) => (
          <div key={index} className="aviso-item">
            <img src={aviso.imagen} alt={aviso.titulo} className="aviso-icono" />
            <div className="aviso-texto">
              <h4>{aviso.titulo}</h4>
              <p>{aviso.descripcion}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Avisos;
