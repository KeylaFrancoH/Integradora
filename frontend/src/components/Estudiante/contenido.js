import React, { useState } from 'react';
import './contenido.css';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FaChalkboardTeacher } from 'react-icons/fa';

const Contenido = () => {
  
 
  const navigate = useNavigate();
 
  const handleNextClick = () => {
    navigate(`/estudiante/temas`);
   
  };

  return (
    <div className="home-container">
      <div>Aqui va el contenido</div>
    </div>
  );
};

export default Contenido;
