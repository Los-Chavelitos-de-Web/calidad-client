import React from 'react';
import './Ubicaciones.css'; // CSS opcional para estilos separados

const ubicaciones = [
  {
    titulo: 'Piura',
    direccion: 'Av. Sanchez Cerro Mz P Lt 05 Urb. Santa Ana, Piura, Perú',
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d1986.73749347406!2d-80.64099581909072!3d-5.187758495647704!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sAv.%20Sanchez%20Cerro%20Mz%20P%20Lt%2005%20Urb.%20Santa%20Ana%2C%20Piura%2C%20Per%C3%BA!5e0!3m2!1ses!2spe!4v1747245147634!5m2!1ses!2spe'
  },
  {
    titulo: 'Tambogrande',
    direccion: 'Av Circunvalación Mz J Lt 11-A, Tambo Grande, Piura, Perú',
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d1987.5385836742355!2d-80.34081902678798!3d-4.926750882268606!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sAv%20Circunvalaci%C3%B3n%20Mz%20J%20Lt%2011-A%2C%20Tambo%20Grande!5e0!3m2!1ses!2spe!4v1747245540474!5m2!1ses!2spe'
  },
  {
    titulo: 'Sullana',
    direccion: 'Calle Independencia 47 B Sullana, Piura, Perú',
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1113.1101406333992!2d-80.68385333665607!3d-4.8900967196096685!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9035fbc9dacf4ce1%3A0xcc15cee92cbd31ae!2sC.%20Independencia%2C%20Sullana%2020101!5e0!3m2!1ses!2spe!4v1747245874866!5m2!1ses!2spe'
  }
];

const Ubicaciones = () => {
  return (
    <section className="ubicaciones">
      <h2>Nuestras Ubicaciones</h2>
      <p className="descripcion">Encuentra nuestras sucursales cerca de ti.</p>
      <div className="ubicaciones-grid">
        {ubicaciones.map((ubicacion, index) => (
          <div key={index} className="ubicacion">
            <iframe
              src={ubicacion.mapSrc}
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title={ubicacion.titulo}
            ></iframe>
            <h4>{ubicacion.titulo}</h4>
            <p className="direccion">{ubicacion.direccion}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Ubicaciones;
