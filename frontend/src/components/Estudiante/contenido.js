import React, { useState } from 'react';
import './contenido.css'; // Importa el archivo de estilos

// Componente para mostrar contenido en cada paso dentro de una tarjeta
const StepCard = ({ title, content }) => (
  <div className="step-card">
    <h2>{title}</h2>
    <div>{content}</div>
  </div>
);

// Componente del Navegador de Secuencia
const Contenido = () => {
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
      <StepCard
        title={stepContents[currentStep - 1].title}
        content={stepContents[currentStep - 1].content}
      />
      <div className="navigation-buttons">
        <button onClick={goToPreviousStep} disabled={currentStep === 1}>
          Anterior
        </button>
        <button onClick={goToNextStep} disabled={currentStep === stepContents.length}>
          Siguiente
        </button>
      </div>
      <p>Paso Actual: {currentStep}</p>
    </div>
  );
};

export default Contenido;
