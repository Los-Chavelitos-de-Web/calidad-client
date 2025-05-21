import './ProductoSlider.css';
import ContProducto from './ContProducto';
import { useRef, useEffect, useState } from 'react';
import Derecha from '/icons/clasificar-derecho.png';
import Izquierda from '/icons/clasificar-izquierda.png';

export function ProductosSlider() {
    const sliderRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = 2; // 6 productos / 3 por página

    const scrollLeft = () => {
        sliderRef.current.scrollBy({ left: -1000, behavior: 'smooth' });
    };

    const scrollRight = () => {
        sliderRef.current.scrollBy({ left: 1000, behavior: 'smooth' });
    };

    // Detectar la página actual al hacer scroll
    useEffect(() => {
        const slider = sliderRef.current;

        const handleScroll = () => {
            const scrollLeft = slider.scrollLeft;
            const pageWidth = 1000;
            const current = Math.round(scrollLeft / pageWidth);
            setCurrentPage(current);
        };

        slider.addEventListener('scroll', handleScroll);
        return () => slider.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="slider-containerp">

            <button className="slider-button left" onClick={scrollLeft}>
                            <img src={Izquierda} alt="Flecha izquierda" className="flecha-img" />
                        </button>
            <div className="slider-wrapper">
            

            <div className="productos-slider" ref={sliderRef}>
                <ContProducto />
                <ContProducto />
                <ContProducto />
                <ContProducto />
                <ContProducto />
                <ContProducto />
            </div>
            </div>

            <button className="slider-button right" onClick={scrollRight}>
                <img src={Derecha} alt="Flecha derecha" className="flecha-img" />
            </button>

        

    <div className="slider-dots">
        {[...Array(totalPages)].map((_, index) => (
            <span
                key={index}
                className={`dot ${currentPage === index ? 'active' : ''}`}
            ></span>
        ))}
    </div>
</div>


    );
}
