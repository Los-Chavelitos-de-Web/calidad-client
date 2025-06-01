import './ContProducto.css';

const ContProducto = ({titulo,descripcion}) => {
    return (
        <article className="product-container">
            <div className="image-wrapper">
                <img 
                src="/productos-img/MINISIERRA A BATERIA GTA-26.jpg" 
                alt="Minisierra a batería GTA-26" 
                className="product-image"
                />
            </div>
            <h2 className="product-title">{titulo}</h2>
            <p className="product-description">
                {descripcion}
            </p>
            <button className="product-button">Comprar ahora</button>
        </article>
    );
};

export default ContProducto;
