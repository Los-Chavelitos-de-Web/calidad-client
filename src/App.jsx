// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Honda from './components/Marcas/Honda';
import Rato from './components/Marcas/Rato';
import Login from './components/Login/Login';
import Registro from './components/Registro/Registro';
import Bonhoeffer from './components/Marcas/Bonhoeffer';
import Cifarelli from './components/Marcas/Cifarelli';
import Ducati from './components/Marcas/Ducati';
import Stihl from './components/Marcas/Stihl';
import ProductosView from './components/admin/products-view';
import AdminAside from './components/admin/template/AdminAside';
import SalesView from './components/admin/sales-view';
import InsertProduct from './components/admin/controller/InsertProduct';
import Carrito from "./components/carrito/Carrito";
import Buscar from "./components/Nav/Buscar";
import Productos from "./components/Productos/Productos";
import ProductoU from "./components/ProductoU/ProductoU";
import UserView from "./components/admin/users-view";
import 'bootstrap/dist/css/bootstrap.min.css';
import ReservaView from './components/admin/reserva-view';
import DashboardView from './components/admin/dashboard-view';
import Perfil from './components/Perfil/Perfil';
import Reservas from './components/Reservas/Reservas';
import Compras from './components/Compras/Compras';
import LibroReclamaciones from './components/LibroReclamaciones/LibroReclamaciones';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/admin" element={<DashboardView/>} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/buscar" element={<Buscar />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/producto/:id" element={<ProductoU />} />
        <Route path="/reservas" element={<Reservas />} />
        <Route path="/compras" element={<Compras />} />
        <Route path="/libro-reclamaciones" element={<LibroReclamaciones />} />


        {/* Marcas */}
        <Route path="/stihl" element={<Stihl />} />
        <Route path="/honda" element={<Honda />} />
        <Route path="/rato" element={<Rato />} />
        <Route path="/bonhoeffer" element={<Bonhoeffer />} />
        <Route path="/cifarelli" element={<Cifarelli />} />
        <Route path="/ducati" element={<Ducati />} />

        {/* Vistas en admin */}
        <Route path="/admin/productos" element={<ProductosView />} />
        <Route path="/admin/ventas" element={<SalesView/>}/>
        <Route path="/admin/users" element={<UserView/>}/>
        <Route path="/admin/reservas" element={<ReservaView/>}/>
        <Route path="/admin/dash" element={<DashboardView/>}/>

        {/*Vista Controladores*/}
        <Route path='/admin/insertar' element={<InsertProduct/>}/>

        <Route path="/admin/aside" element={<AdminAside />} />
        <Route path="/admin/aside/productos" element={<ProductosView />} />

        <Route path="/perfil" element={<Perfil />} />



      </Routes>
    </Router>
  );
}

export default App;
