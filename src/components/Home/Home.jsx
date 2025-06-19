// Home.jsx
import React from 'react';
import styles from './Home.module.css';
import NavBar from '../Nav/NavBar';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { ProductosSlider } from "../ProductoSlider/ProductoSlider";
import Footer from '../Footer/Footer';
import Ubicaciones from '../MapsSecttion/Ubicaciones';
import Avisos from '../Avisos/Avisos';
import SPrincipal from '../SPrincipal/SPrincipal';
import UltimoVideo from '../YSecttion/YSecction';

const brandButtons = [
  { name: "STIHL", img: "/img/stihl.png", route: "/stihl" },
  { name: "HONDA", img: "/img/Honda.jpg", route: "/honda" },
  { name: "RATO", img: "/img/rato.jpg", route: "/rato" },
  { name: "BONHOEFFER", img: "/img/bonhoeffer.jpg", route: "/bonhoeffer" },
  { name: "CIFARELLI", img: "/img/cifarelli.jpg", route: "/cifarelli" },
  { name: "DUCATI", img: "/img/ducati.jpg", route: "/ducati" },
];

const CustomPrevArrow = ({ onClick }) => (
  <div className={`${styles.customArrow} ${styles.customPrev}`} onClick={onClick}>
    <FaArrowLeft size={20} color="#fff" />
  </div>
);

const CustomNextArrow = ({ onClick }) => (
  <div className={`${styles.customArrow} ${styles.customNext}`} onClick={onClick}>
    <FaArrowRight size={20} color="#fff" />
  </div>
);

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.homeBg}>
      <NavBar />

      <div id="inicio" className={styles.sliderContainer}>
        <SPrincipal />
      </div>

      <div className={styles.brandButtons}>
        {brandButtons.map((brand) => (
          <button
            key={brand.name}
            className={styles.brandBtn}
            onClick={() => navigate(brand.route)}
          >
            <img src={brand.img} alt={brand.name} className={styles.brandLogo} />
            <span>{brand.name}</span>
          </button>
        ))}
      </div>

      <div id="ofertas">
        <ProductosSlider />
      </div>

      <div id="nosotros">
        <UltimoVideo />
      </div>

      <div id="contacto">
        <Ubicaciones />
      </div>

      <div>
        <Avisos />
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Home;
