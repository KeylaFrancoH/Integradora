import React from 'react';
import { Card, Button, Text, Group, Badge } from '@mantine/core';
import { Accordion, AccordionItem } from '@mantine/core';

import './estudiantehome.css';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const EstudianteHome = () => {
  
 
  const navigate = useNavigate();
 
  const handleNextClick = () => {
    navigate(`/estudiante/temas`);
   
  };

  return (
    <div className="home-container">
      <div className="header-container" >
        <h1 className="clases">Mis Clases</h1>
        <div class="underline"></div>
      </div>
      <div className="cards" onClick={handleNextClick}>
            <div  className="card">
              <div className='tituloscard'>curso.Titulo</div> 
              <p className='descripcioncard'>curso.Descripcion</p>
            </div>
      </div>
    </div>
  );
};

export default EstudianteHome;
