import React from 'react';
import './addtopic.css';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const AddTopic = () => {

 
  const navigate = useNavigate();
  const { idCurso } = useParams();
  const location = useLocation();
  const cursoTitulo = location.state?.cursoTitulo || "Curso no especificado";
  
 
  const handleNextClick = () => {
    navigate(`/anadir-tema/${idCurso}/grafica`, { state: { cursoTitulo } });
   
  };

  return (
    <div className="add-topic-container">
      <h1 className="tema">Añadir Tema para {cursoTitulo}</h1>
      <form>
        <div className="section">
          <h2>Teoría</h2>
          <div className="input-group">
            <input type="text" placeholder="Título *" />
            <input type="text" placeholder="Subtítulo" />
          </div>
        </div>
        <div className="section">
          <h2>Material</h2>
          <textarea className="areatexto" placeholder="Material" rows="10" cols="20"></textarea>
        </div>
        <div className="section">
          <h2>Adjuntar</h2>
          <div className="attachment-buttons">
            <button type="button">YouTube</button>
            <button type="button">Enlace</button>
            <button type="button">Subir</button>
          </div>
        </div>
        <div className="navigation-buttons">
          <button type="button" className="next-button" onClick={handleNextClick}>Siguiente</button>
        </div>
        <div className="dots">
          <span className="dot"></span>
          <span className="dot active"></span>
          <span className="dot"></span>
        </div>
      </form>
    </div>
  );
};

export default AddTopic;
