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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        {/* Add more routes for other components here */}
        
        {/* Example routes for different brands */}
        
        <Route path="/honda" element={<Honda />} />
        <Route path="/rato" element={<Rato />} />
        <Route path="/bonhoeffer" element={<Bonhoeffer />} />
        <Route path="/cifarelli" element={<Cifarelli />} />
        <Route path="/ducati" element={<Ducati />} />
        {/* Add more routes as needed */}
        
      </Routes>
    </Router>
  );
}

export default App;
