import React from 'react';
import styles from './Home.module.css';
import NavBar from '../Nav/NavBar';
import Slider from "react-slick";
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import {ProductosSlider} from "../ProductoSlider/ProductoSlider"
import Footer from '../Footer/Footer';
import Ubicaciones from '../MapsSecttion/Ubicaciones';
import Avisos from '../Avisos/Avisos';
import SPrincipal from '../SPrincipal/SPrincipal';
import UltimoVideo from '../YSecttion/YSecction';


// Imágenes del slider
const sliderImages = [
  "/img/banner001.jpg",
  // Puedes agregar más: "/img/banner002.jpg", etc.
];

// Botones de marcas
const brandButtons = [
  { name: "HONDA", img: "/img/Honda.jpg", route: "/honda" },
  { name: "RATO", img: "/img/rato.jpg", route: "/rato" },
  { name: "BONHOEFFER", img: "/img/bonhoeffer.jpg", route: "/bonhoeffer" },
  { name: "CIFARELLI", img: "/img/cifarelli.jpg", route: "/cifarelli" },
  { name: "DUCATI", img: "/img/ducati.jpg", route: "/ducati" },
];

// Flechas personalizadas para el slider
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

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,          
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 4000,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />
  };

  return (
    <div className={styles.homeBg}>
      <NavBar />

      {/* Slider principal */}
      <div className={styles.sliderContainer}>
        <SPrincipal></SPrincipal>
      </div>

      {/* Botones de marcas */}
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
      <div>
        <ProductosSlider/>
      </div>
      <div>
        <UltimoVideo/>
      </div>
      <div>
        <Ubicaciones/>
      </div>
      <div>
        <Avisos/>
      </div>
      <div>
        <Footer/>
      </div>
    </div>
  );
};

export default Home;
