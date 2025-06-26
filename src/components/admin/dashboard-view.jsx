import { useEffect, useState } from "react";
import AdminAside from "./template/AdminAside";
import { useNavigate } from "react-router-dom";
import { usePayload } from "../../utils/authHelpers";
import DashboardChart from "./DashboardChart";
import './admin-css/dashboard-view.css';

const DashboardView = () => {
  const navigate = useNavigate();
  const [productosData, setProductosData] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [isLoadingProductos, setIsLoadingProductos] = useState(false);
  const [isLoadingUsuarios, setIsLoadingUsuarios] = useState(false);
  const [isLoadingVentas, setIsLoadingVentas] = useState(false);

  const { authToken, error, loading } = usePayload();

  // Obtener productos
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

  // Obtener usuarios
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

  // Obtener ventas (versión optimizada)
  async function getVentas() {
    try {
      setIsLoadingVentas(true);
      const res = await fetch(`${import.meta.env.VITE_APP_BACK}/sales/getAll`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      
      const ventasData = await res.json();
      setVentas(ventasData);
      
      // Depuración: Mostrar las primeras 5 ventas en consola
      console.log("Datos de ventas recibidos:", ventasData.slice(0, 5));
    } catch (error) {
      console.error("Error al obtener ventas:", error);
      setVentas([]); // Asegurar que el estado no quede undefined
    } finally {
      setIsLoadingVentas(false);
    }
  }

  useEffect(() => {
    if (loading) return;
    if (error) {
      console.warn(error);
      navigate("/login");
      return;
    }

    // Cargar todos los datos
    const loadData = async () => {
      await Promise.all([
        getProductos(),
        getUsuarios(),
        getVentas()
      ]);
    };

    loadData();
  }, [loading, error, authToken, navigate]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-aside">
        <AdminAside />
      </div>

      <div className="dashboard-main">
        <h1 className="dashboard-title">Panel de administración</h1>

        <div className="cards-container">
          {/* Card de Productos */}
          <div className="dashboard-card0 card-productos">
            {isLoadingProductos ? (
              <p>Cargando productos...</p>
            ) : (
              <>
                <h2>Productos</h2>
                <p className="card-count">{productosData.length}</p>
                <p className="card-description">Total en inventario</p>
              </>
            )}
          </div>

          {/* Card de Clientes */}
          <div className="dashboard-card1 card-clientes">
            {isLoadingUsuarios ? (
              <p>Cargando usuarios...</p>
            ) : (
              <>
                <h2>Clientes</h2>
                <p className="card-count">{clientes.length}</p>
                <p className="card-description">Clientes registrados</p>
              </>
            )}
          </div>

          {/* Card de Empleados */}
          <div className="dashboard-card2 card-empleados">
            {isLoadingUsuarios ? (
              <p>Cargando usuarios...</p>
            ) : (
              <>
                <h2>Trabajadores</h2>
                <p className="card-count">{empleados.length}</p>
                <p className="card-description">Equipo activo</p>
              </>
            )}
          </div>
        </div>

        {/* Gráfico de ventas */}
        <DashboardChart 
          ventas={ventas} 
          isLoading={isLoadingVentas} 
        />
      </div>
    </div>
  );
};

export default DashboardView;