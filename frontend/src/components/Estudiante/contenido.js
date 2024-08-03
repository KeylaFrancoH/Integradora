import React, { useState, useEffect } from 'react';
import './contenido.css'; // Importa el archivo de estilos
import { FaBook, FaPencilAlt, FaVideo, FaPuzzlePiece, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

// Componente para mostrar contenido en cada paso dentro de una tarjeta
const StepCard = ({ title, content }) => (
  <div className="step-card">
    <h2>{title}</h2>
    <div>{content}</div>
  </div>
);

// Componente del Navegador de Secuencia
const Contenido = () => {
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const { courseTitle, temaId, temaTitle } = location.state;
  const [material, setMaterial] = useState('');
  const [enlaces, setEnlaces] = useState([]); // Inicializar como un arreglo vacío

  useEffect(() => {
    const fetchTemaMaterial = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/temas/${temaId}`);
        const tema = response.data;
        setMaterial(tema.Material);
      } catch (error) {
        console.error('Error al obtener el material del tema:', error);
      }
    };

    const fetchEnlaces = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/enlaces/${temaId}`);
        const enlacesData = response.data;
        setEnlaces(Array.isArray(enlacesData) ? enlacesData : []); // Asegurarse de que enlacesData sea un arreglo
      } catch (error) {
        console.error('Error al obtener los enlaces del tema:', error);
      }
    };

    fetchTemaMaterial();
    fetchEnlaces();
  }, [temaId]);

  const stepContents = [
    {
      title: "Paso 1",
      content: "Contenido variado del Paso 1. Puedes incluir imágenes, texto, o cualquier otro componente."
    },
    {
      title: "Paso 2",
      content: (
        <ul>
          {enlaces.length > 0 ? (
            enlaces.map((enlace, index) => (
              <li key={index}>
                <a href={enlace.Enlace} target="_blank" rel="noopener noreferrer">
                  {enlace.Enlace}
                </a>
              </li>
            ))
          ) : (
            <li>No hay enlaces disponibles.</li>
          )}
        </ul>
      )
    },
    {
      title: "Paso 3",
      content: "Contenido variado del Paso 3. Aquí puedes mostrar formularios, tablas, o cualquier otra cosa."
    },
    {
      title: "Paso 4",
      content: "Contenido variado del Paso 4. Este espacio puede ser utilizado para cualquier contenido adicional."
    },
    {
      title: "Paso 5",
      content: "Contenido variado del Paso 5. El paso final puede incluir un resumen o conclusiones."
    }
  ];

  const goToNextStep = () => {
    if (currentStep < stepContents.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const showSection2Button = enlaces.length > 0;

  return (
    <div className="sequence-navigator">
      <div className="header-container">
        <h1 className="clases">{`${courseTitle} > ${temaTitle}`}</h1>
        <div className="underline"></div>
      </div>
      <div className="navigation-buttons">
        <button onClick={goToPreviousStep} className="arrow-button">
          <FaArrowLeft />
        </button>
        <button onClick={() => setCurrentStep(1)} className={currentStep === 1 ? 'active' : ''}>
          <FaBook />
        </button>
        <button 
          onClick={() => setCurrentStep(2)} 
          className={`step-button ${currentStep === 2 ? 'active' : ''} ${!showSection2Button ? 'hidden' : ''}`}
        >
          <FaPencilAlt />
        </button>
        <button onClick={() => setCurrentStep(3)} className={currentStep === 3 ? 'active' : ''}>
          <FaVideo />
        </button>
        <button onClick={() => setCurrentStep(4)} className={currentStep === 4 ? 'active' : ''}>
          <FaPuzzlePiece />
        </button>
        <button onClick={() => setCurrentStep(5)} className={currentStep === 5 ? 'active' : ''}>
          <FaPuzzlePiece />
        </button>
        <button onClick={goToNextStep} className="arrow-button">
          <FaArrowRight />
        </button>
      </div>
      <StepCard
        title={stepContents[currentStep - 1].title}
        content={stepContents[currentStep - 1].content}
      />
      <p></p>
      {/* Nueva sección para Archivos */}
      <div className="header-container">
        <div className="overline"></div>
        <h2 className="clases">Archivos</h2>
        <div className="archivo-content">
          <button className="download-button">Descargar</button>
          <span className="archivo-description">Descripción del archivo</span>
        </div>
      </div>
    </div>
  );
};

export default Contenido;
