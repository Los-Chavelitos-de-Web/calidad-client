import './ContProducto.css';

const ContProducto = () => {
    return (
        <article className="product-container">
            <div className="image-wrapper">
                <img 
                src="/productos-img/MINISIERRA A BATERIA GTA-26.jpg" 
                alt="Minisierra a batería GTA-26" 
                className="product-image"
                />
            </div>
            <h2 className="product-title">Minisierra GTA-26</h2>
            <p className="product-description">
                Breve resumen del producto. Potente y compacta para trabajos de jardinería.
            </p>
            <button className="product-button">Comprar ahora</button>
        </article>
    );
};

export default ContProducto;
