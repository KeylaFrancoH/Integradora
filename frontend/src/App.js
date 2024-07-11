import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './login';
import Inicio from './inicio';
import Clientes from './pages/Clientes';
import Producto from './pages/Producto';
import Factura from './pages//Factura';
import Sidebar from './Components/Sidebar';

import ActualizarCliente from './pages/client/actualizarCliente';

import CrearProducto from './pages/product/CrearProducto';
import ActualizarProducto from './pages/product/ActualizarProduct';

import CrearFactura from './pages/factura/CrearFactura';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/inicio" element={<><Sidebar /><Inicio /></>} />
        <Route path="/Clientes" element={<><Sidebar /><Clientes /></>} />
        <Route path="/Clientes/Actualizar/:id" element={<><Sidebar /><ActualizarCliente /></>} />

        <Route path="/Productos" element={<><Sidebar /><Producto /></>} />
        <Route path="/Productos/Crear" element={<><Sidebar /><CrearProducto /></>} />
        <Route path="/Productos/Actualizar/:id" element={<><Sidebar /><ActualizarProducto /></>} />

        <Route path="/Facturacion" element={<><Sidebar /><Factura /></>} />

        <Route path="/Facturacion/Crear" element={<><Sidebar /><CrearFactura /></>} />

      </Routes>
    </Router>
  );
}

export default App;
