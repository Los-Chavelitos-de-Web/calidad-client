import "./ContProducto.css";
import { useNavigate } from "react-router-dom";

const ContProducto = ({ id, titulo, marca, imageUrl }) => {
  const navigate = useNavigate();
  const irADetalle = () => {
    navigate(`/producto/${id}`);
  };

  return (
    <article className="product-container">
      <div className="image-wrapper">
        <img
          src={imageUrl}
          alt={titulo}
          className="product-image"
        />
      </div>
      <h2 className="product-title">{titulo}</h2>
      <p className="product-brand">{marca}</p>
      <button className="product-button" onClick={irADetalle}>
        Ver producto
      </button>
    </article>
  );
};

export default ContProducto;
