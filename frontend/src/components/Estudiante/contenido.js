import React, { useState } from 'react';
import './contenido.css'; // Importa el archivo de estilos
import { FaBook, FaPencilAlt, FaVideo, FaPuzzlePiece, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

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
  const { idTema } = location.state;
  const [currentStep, setCurrentStep] = useState(1);

  const stepContents = [
    {
      title: "Paso 1",
      content: "Contenido variado del Paso 1. Puedes incluir imágenes, texto, o cualquier otro componente."
    },
    {
      title: "Paso 2",
      content: "Contenido variado del Paso 2. Agrega lo que necesites aquí, como gráficos, listas, etc."
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
        <h1 className="clases">Linea de Ruta {idTema}</h1>
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
