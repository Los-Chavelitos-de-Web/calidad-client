import React from 'react';
import styles from './Home.module.css';
import NavBar from '../Nav/NavBar';
import Slider from "react-slick";
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

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
        <Slider {...sliderSettings}>
          {sliderImages.map((src, idx) => (
            <div key={idx} className={styles.slide}>
              <img src={src} alt={`slide-${idx}`} className={styles.sliderImg} />
            </div>
          ))}
        </Slider>
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
    </div>
  );
};

export default Home;
