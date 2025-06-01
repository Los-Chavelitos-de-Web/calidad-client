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
import AdminAside from './components/admin/AdminAside';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/admin" element={<AdminAside />} />
        <Route path="/carrito" element={<Carrito />} />

        {/* Marcas */}
        <Route path="/honda" element={<Honda />} />
        <Route path="/rato" element={<Rato />} />
        <Route path="/bonhoeffer" element={<Bonhoeffer />} />
        <Route path="/cifarelli" element={<Cifarelli />} />
        <Route path="/ducati" element={<Ducati />} />

        {/* Vistas en admin */}
        <Route path="/admin/productos" element={<ProductosView />} />
        <Route path="/admin/ventas" element={<SalesView/>}/>

        {/*Vista Controladores*/}
        <Route path='/admin/insertar' element={<InsertProduct/>}/>
      </Routes>
    </Router>
  );
}

export default App;
