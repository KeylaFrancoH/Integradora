import React from 'react';
import { Card, Button, Text, Group, Badge } from '@mantine/core';
import './estudiantehome.css';

const EstudianteHome = () => {
  return (
    <div className="home-container">
      <div className="header-container">
        <h1>Mis Clases</h1>
        <div class="underline"></div>
      </div>
      <div className="cards">
            <div  className="card">
              <h2>curso.Titulo</h2> 
              <p>curso.Descripcion</p>
            </div>
      </div>
    </div>
  );
};

export default EstudianteHome;
