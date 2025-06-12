import { useEffect, useState } from "react";
import AdminAside from "./template/AdminAside";
import { useNavigate } from "react-router-dom";
import { usePayload } from "../../utils/authHelpers";
import './admin-css/dashboard-view.css';

const DashboardView = () => {
  const navigate = useNavigate();

  const [productosData, setProductosData] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [isLoadingProductos, setIsLoadingProductos] = useState(false);
  const [isLoadingUsuarios, setIsLoadingUsuarios] = useState(false);

  const { authToken, error, loading } = usePayload();

  async function getProductos() {
    try {
      setIsLoadingProductos(true);
      const res = await fetch(`${import.meta.env.VITE_APP_BACK}/products/getAll`);
      const productos = await res.json();
      setProductosData(productos);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    } finally {
      setIsLoadingProductos(false);
    }
  }

  async function getUsuarios() {
    try {
      setIsLoadingUsuarios(true);
      const res = await fetch(`${import.meta.env.VITE_APP_BACK}/users/getAll`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const usuarios = await res.json();
      const soloClientes = usuarios.filter((user) => user.role === "CLIENTE");
      const soloEmpleados = usuarios.filter((user) => user.role === "GERENTE");

      setClientes(soloClientes);
      setEmpleados(soloEmpleados);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    } finally {
      setIsLoadingUsuarios(false);
    }
  }

  useEffect(() => {
    if (loading) return;
    if (error) {
      console.warn(error);
      navigate("/login");
      return;
    }

    getProductos();
    getUsuarios();
  }, [loading, error]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-aside">
        <AdminAside />
      </div>

      <div className="dashboard-main">
        <h1 className="dashboard-title">Panel de administración</h1>

        <div className="cards-container">
          <div className="dashboard-card0">
            {isLoadingProductos ? (
              <p>Cargando productos...</p>
            ) : (
              <>
                <h2>Productos</h2>
                <p className="card-count">{productosData.length}</p>
              </>
            )}
          </div>

          <div className="dashboard-card1">
            {isLoadingUsuarios ? (
              <p>Cargando usuarios...</p>
            ) : (
              <>
                <h2>Clientes</h2>
                <p className="card-count">{clientes.length}</p>
              </>
            )}
          </div>

          <div className="dashboard-card2">
            {isLoadingUsuarios ? (
              <p>Cargando usuarios...</p>
            ) : (
              <>
                <h2>Trabajadores</h2>
                <p className="card-count">{empleados.length}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
