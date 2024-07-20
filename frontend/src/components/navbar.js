import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

const NavBar = () => {
  return (
    <div className="navbar">
      <Link to="/perfil">Perfil</Link>
      <Link to="/inicio">Inicio</Link>
    </div>
  );
};

export default NavBar;
