// src/components/BotonCompra.jsx
import { usePayload } from "../../utils/authHelpers";
import Cookies from "js-cookie";
import styles from "./Carrito.module.css"; // Asegúrate de tener este archivo CSS

const BotonCompra = ({ carritoGuardado }) => {
  const { email } = usePayload(); // Obtiene el email del usuario autenticado
  const hoy = new Date().toISOString();

  const handleComprar = async () => {
    const carritoConDatos = carritoGuardado.map((producto) => ({
      id: producto.id,
      title: producto.title,
      brand: producto.brand || "Marca genérica",
      unit_price: producto.unit_price || producto.precio || 0,
      stock: producto.stock || 100,
      quantity: producto.quantity || producto.cantidad || 1,
      image: producto.imageUrl || "https://via.placeholder.com/100",
      createdAt: producto.createdAt || hoy,
    }));

    const payload = {
      correo: email, // Correo del usuario autenticado
      items: carritoConDatos, // Productos del carrito
    };

    try {
      // Realiza la solicitud al backend para crear la orden de pago
      const response = await fetch(`${import.meta.env.VITE_APP_BACK}/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("authToken")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Error al crear la orden de pago.");
      }

      const data = await response.json();

      // Verifica si se obtuvo un punto de inicio para la compra
      if (data.init_point) {
        localStorage.setItem("compra_en_proceso", "true");  // Marca que hay una compra en proceso
        window.location.href = data.init_point; // Redirige al usuario a la URL de pago
      }
    } catch (error) {
      // Manejo de errores si algo falla durante la compra
      console.error("Error al procesar la compra:", error.message);
    }
  };

  return (
    <button className={styles.btnComprar} onClick={handleComprar}>
      Continuar compra
    </button>
  );
};

export default BotonCompra;
