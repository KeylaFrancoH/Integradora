import React from 'react';
import './navbar.css';
import logo from '../../assets/fiec.png'; // Ajusta la ruta según tu estructura de carpetas
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleNextClick = () => {
    navigate(`/estudiante/temas`);
   
  };
  return (
    <header className="navbar">
      <img src={logo} alt="ESPOL Logooo" className="logo" />
      <nav className="nav">
        <a href="" onClick={handleNextClick}>Inicio</a>
        <a href="#perfil">Perfil</a>
        <button className="logout">Cerrar Sesión</button>
      </nav>
    </header>
  );
};
export default Navbar;
