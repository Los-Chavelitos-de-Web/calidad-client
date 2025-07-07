import "./ProductoSlider.css";
import ContProducto from "./ContProducto";
import { useRef, useEffect, useState } from "react";
import Derecha from "/icons/clasificar-derecho.png";
import Izquierda from "/icons/clasificar-izquierda.png";

export function ProductosSlider() {
  const sliderRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  //funcion para exportar datos
  const [data, setData] = useState([]);

  const totalPages = 2; // 6 productos / 3 por página

  const scrollLeft = () => {
    sliderRef.current.scrollBy({ left: -1000, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({ left: 1000, behavior: "smooth" });
  };

  //this

  async function getdata() {
    const res = await fetch(`${import.meta.env.VITE_APP_BACK}/products/getAll`);
    const data = await res.json();
    console.log(data);
    setData(data.slice(0, 5));
  }

  useEffect(() => {
    getdata();
  }, []);

  // Detectar la página actual al hacer scroll
  useEffect(() => {
    const slider = sliderRef.current;

    const handleScroll = () => {
      const scrollLeft = slider.scrollLeft;
      const pageWidth = 1000;
      const current = Math.round(scrollLeft / pageWidth);
      setCurrentPage(current);
    };

    slider.addEventListener("scroll", handleScroll);
    return () => slider.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="slider-containerp">
      <div className="title-slider">Productos que te recomendamos</div>

      <button className="slider-button left" onClick={scrollLeft}>
        <img src={Izquierda} alt="Flecha izquierda" className="flecha-img" />
      </button>
      <div className="slider-wrapper">
        <div className="productos-slider" ref={sliderRef}>
          {data.map((p) => (
            <ContProducto
              key={p.id}
              id={p.id}
              titulo={p.title}
              marca={p.brand}
            />
          ))}
        </div>
      </div>

      <button className="slider-button right" onClick={scrollRight}>
        <img src={Derecha} alt="Flecha derecha" className="flecha-img" />
      </button>

      <div className="slider-dots">
        {[...Array(totalPages)].map((_, index) => (
          <span
            key={index}
            className={`dot ${currentPage === index ? "active" : ""}`}
          ></span>
        ))}
      </div>
    </div>
  );
}
