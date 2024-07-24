import React from 'react';
import './navbar.css';
import logo from '../../assets/fiec.png'; // Ajusta la ruta según tu estructura de carpetas

const Navbar = () => {
  return (
    <header className="navbar">
      <img src={logo} alt="ESPOL Logooo" className="logo" />
      <nav className="nav">
        <a href="#inicio">Inicio</a>
        <a href="#temas">Temas</a>
        <a href="#perfil">Perfil</a>
        <button className="logout">Cerrar Sesión</button>
      </nav>
    </header>
  );
};
export default Navbar;
