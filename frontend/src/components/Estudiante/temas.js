import React from 'react';
import { Card, Button, Text, Group, Badge } from '@mantine/core';
import './temas.css';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FaChalkboardTeacher } from 'react-icons/fa'; 
const EstudianteHome = () => {
  

  return (
    <div className="nueva-vista-container">
        <h1 className="temas">Temas</h1>
        <div class="underline"></div>
      <div className="nueva-vista-card">
        <div className="nueva-vista-header">
          <FaChalkboardTeacher className="nueva-vista-icon" />
          <span>Aprendizaje Supervisado</span>
        </div>
        <div className="nueva-vista-body">
          <p>Regresión Lineal</p>
        </div>
      </div>

      <div className="nueva-vista-card">
        <div className="nueva-vista-header">
          <FaChalkboardTeacher className="nueva-vista-icon" />
          <span>Aprendizaje No Supervisado</span>
        </div>
        <div className="nueva-vista-body">
          <p>Clustering</p>
        </div>
      </div>
    </div>
  );
};

export default EstudianteHome;
