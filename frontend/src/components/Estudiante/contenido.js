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
  const [enlace, setEnlace] = useState('');

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

    const fetchEnlace = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/enlaces/${temaId}`);
        const enlaceData = response.data;
        setEnlace(enlaceData.Enlace);
      } catch (error) {
        console.error('Error al obtener el enlace del tema:', error);
      }
    };

    fetchTemaMaterial();
    fetchEnlace();
  }, [temaId]);

  const stepContents = [
    {
      title: "Paso 1",
      content: "Contenido variado del Paso 1. Puedes incluir imágenes, texto, o cualquier otro componente."
    },
    {
      title: "Paso 2",
      content: (
        <div>
          {enlace ? (
            enlace.includes('youtube.com') ? (
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${enlace.split('v=')[1]}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Video de YouTube"
              ></iframe>
            ) : (
              <a href={enlace} target="_blank" rel="noopener noreferrer">
                Ver contenido
              </a>
            )
          ) : (
            "Cargando enlace..."
          )}
        </div>
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
        <button onClick={() => setCurrentStep(2)} className={currentStep === 2 ? 'active' : ''}>
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
