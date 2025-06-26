import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './admin-css/dashboardChart.css';

const DashboardChart = ({ ventas, isLoading }) => {
  const [filtro, setFiltro] = useState('semana');
  const [datosFiltrados, setDatosFiltrados] = useState([]);
  const [fechaInicio, setFechaInicio] = useState(new Date());
  const [fechaFin, setFechaFin] = useState(new Date());

  // Procesar datos según el filtro seleccionado
  useEffect(() => {
    if (isLoading || !ventas || ventas.length === 0) {
      setDatosFiltrados([]);
      return;
    }

    const parsearFecha = (fechaStr) => {
      try {
        if (typeof fechaStr === 'string' && fechaStr.includes(' ')) {
          const [fechaPart] = fechaStr.split(' ');
          return new Date(fechaPart);
        }
        return new Date(fechaStr);
      } catch (e) {
        console.error('Error al parsear fecha:', fechaStr, e);
        return new Date();
      }
    };

    const procesarDatos = () => {
      let datosProcesados = [];
      const ventasFiltradas = ventas.filter(venta => {
        const fechaVenta = parsearFecha(venta.fecha || venta.createdAt || venta.fechaVenta);
        return fechaVenta >= fechaInicio && fechaVenta <= fechaFin;
      });

      if (filtro === 'hoy') {
        // Agrupar por hora del día
        const ventasPorHora = Array(24).fill(0);
        
        ventasFiltradas.forEach(venta => {
          const fecha = parsearFecha(venta.fecha || venta.createdAt);
          const hora = fecha.getHours();
          ventasPorHora[hora]++;
        });
        
        datosProcesados = ventasPorHora.map((ventas, hora) => ({
          periodo: `${hora}:00`,
          ventas
        }));
      } 
      else if (filtro === 'semana') {
        // Agrupar por día de semana
        const ventasPorDia = [0, 0, 0, 0, 0, 0, 0];
        
        ventasFiltradas.forEach(venta => {
          const fecha = parsearFecha(venta.fecha || venta.createdAt);
          const diaSemana = fecha.getDay();
          const indice = diaSemana === 0 ? 6 : diaSemana - 1;
          ventasPorDia[indice]++;
        });
        
        const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
        datosProcesados = dias.map((dia, index) => ({
          periodo: dia,
          ventas: ventasPorDia[index]
        }));
      }
      else if (filtro === 'mes') {
        // Agrupar por día del mes
        const diasEnMes = new Date(
          fechaFin.getFullYear(), 
          fechaFin.getMonth() + 1, 
          0
        ).getDate();
        
        const ventasPorDia = Array(diasEnMes).fill(0);
        
        ventasFiltradas.forEach(venta => {
          const fecha = parsearFecha(venta.fecha || venta.createdAt);
          const diaMes = fecha.getDate() - 1;
          if (diaMes >= 0 && diaMes < diasEnMes) {
            ventasPorDia[diaMes]++;
          }
        });
        
        datosProcesados = ventasPorDia.map((ventas, index) => ({
          periodo: `Día ${index + 1}`,
          ventas
        }));
      }
      else {
        // Personalizado - agrupar por fecha exacta
        const ventasPorFecha = {};
        
        ventasFiltradas.forEach(venta => {
          const fecha = parsearFecha(venta.fecha || venta.createdAt).toLocaleDateString();
          ventasPorFecha[fecha] = (ventasPorFecha[fecha] || 0) + 1;
        });
        
        datosProcesados = Object.entries(ventasPorFecha).map(([fecha, ventas]) => ({
          periodo: fecha,
          ventas
        })).sort((a, b) => new Date(a.periodo) - new Date(b.periodo));
      }
      
      setDatosFiltrados(datosProcesados);
    };

    procesarDatos();
  }, [ventas, isLoading, filtro, fechaInicio, fechaFin]);

  // Ajustar fechas según el filtro seleccionado
  useEffect(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    if (filtro === 'hoy') {
      setFechaInicio(hoy);
      const finDia = new Date(hoy);
      finDia.setHours(23, 59, 59, 999);
      setFechaFin(finDia);
    } 
    else if (filtro === 'semana') {
      const inicioSemana = new Date(hoy);
      inicioSemana.setDate(hoy.getDate() - hoy.getDay() + (hoy.getDay() === 0 ? -6 : 1));
      setFechaInicio(inicioSemana);
      const finSemana = new Date(inicioSemana);
      finSemana.setDate(inicioSemana.getDate() + 6);
      finSemana.setHours(23, 59, 59, 999);
      setFechaFin(finSemana);
    } 
    else if (filtro === 'mes') {
      const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
      setFechaInicio(inicioMes);
      const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
      finMes.setHours(23, 59, 59, 999);
      setFechaFin(finMes);
    }
  }, [filtro]);

  if (isLoading) {
    return <div className="chart-container"><p>Cargando datos de ventas...</p></div>;
  }

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h2>
          {filtro === 'hoy' && 'Ventas de hoy'}
          {filtro === 'semana' && 'Ventas de esta semana'}
          {filtro === 'mes' && 'Ventas de este mes'}
          {filtro === 'personalizado' && 'Ventas del período seleccionado'}
        </h2>
        
        <div className="filtros-container">
          <select 
            value={filtro} 
            onChange={(e) => setFiltro(e.target.value)}
            className="filtro-select"
          >
            <option value="hoy">Hoy</option>
            <option value="semana">Esta semana</option>
            <option value="mes">Este mes</option>
            <option value="personalizado">Personalizado</option>
          </select>

          {filtro === 'personalizado' && (
            <div className="date-pickers">
              <DatePicker
                selected={fechaInicio}
                onChange={(date) => setFechaInicio(date)}
                selectsStart
                startDate={fechaInicio}
                endDate={fechaFin}
                maxDate={fechaFin}
                className="date-picker"
                dateFormat="dd/MM/yyyy"
                placeholderText="Fecha inicio"
              />
              <span>a</span>
              <DatePicker
                selected={fechaFin}
                onChange={(date) => setFechaFin(date)}
                selectsEnd
                startDate={fechaInicio}
                endDate={fechaFin}
                minDate={fechaInicio}
                className="date-picker"
                dateFormat="dd/MM/yyyy"
                placeholderText="Fecha fin"
              />
            </div>
          )}
        </div>
      </div>

      {datosFiltrados.length > 0 ? (
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart
              data={datosFiltrados}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="periodo" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="ventas" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p>No hay ventas en el período seleccionado</p>
      )}
    </div>
  );
};

export default DashboardChart;