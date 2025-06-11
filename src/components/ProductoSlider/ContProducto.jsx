import './ContProducto.css';

const ContProducto = ({titulo,marca}) => {
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
            <p className="product-brand">
                {marca}
            </p>
            <button className="product-button">Ver producto</button>
        </article>
    );
};

export default ContProducto;
