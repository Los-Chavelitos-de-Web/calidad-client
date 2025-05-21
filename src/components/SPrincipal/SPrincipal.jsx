import React, { useEffect, useRef } from 'react';
import './SPrincipal.css';

const images = [
  '/img/1.png',
  '/img/2.png',
  '/img/3.png'
];

const SPrincipal = () => {
  const sliderRef = useRef(null);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (sliderRef.current) {
        index = (index + 1) % images.length;
        sliderRef.current.style.transform = `translateX(-${index * 100}%)`;
      }
    }, 3000); // cambia de imagen cada 3 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="slider-container">
      <div className="slider" ref={sliderRef}>
        {images.map((img, idx) => (
          <img key={idx} src={img} alt={`slide-${idx}`} />
        ))}
      </div>
    </div>
  );
};

export default SPrincipal;
