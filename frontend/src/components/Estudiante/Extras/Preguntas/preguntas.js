import React, { useState } from 'react';
import './preguntas.css';
import successImage from '../../../../img/victory.png';
import retryImage from '../../../../img/retroalimentacion.png';
const questions = [
  {
    id: 1,
    idCurso: 1,
    idTema: 1,
    text: "¿Cómo afecta agregar más puntos a la gráfica de regresión lineal a la pendiente de la línea de ajuste?",
    points: 10,
    options: [
      "a) La pendiente siempre aumenta.",
      "b) La pendiente siempre disminuye.",
      "c) La pendiente puede aumentar, disminuir o mantenerse igual dependiendo de los puntos añadidos.",
      "d) La pendiente no se ve afectada por la adición de puntos."
    ],
    correctAnswer: 2,
    attempts: 1,
    feedback: "La pendiente puede variar dependiendo de los puntos añadidos. Si los puntos siguen la tendencia general, la pendiente podría no cambiar significativamente, pero si son puntos extremos, la pendiente podría aumentar o disminuir."
  },
  {
    id: 2,
    idCurso: 1,
    idTema: 1,
    text: "Si se eliminan puntos extremos de la gráfica, ¿cómo cambia la ecuación de la línea de regresión?",
    points: 10,
    options: [
      "a) La pendiente y la intersección de la línea de regresión permanecen iguales.",
      "b) La pendiente y la intersección de la línea de regresión cambian.",
      "c) Solo la intersección cambia, mientras que la pendiente permanece igual.",
      "d) Solo la pendiente cambia, mientras que la intersección permanece igual."
    ],
    correctAnswer: 1,
    attempts: 1,
    feedback: "Eliminar puntos extremos generalmente cambia tanto la pendiente como la intersección, ya que estos puntos tienen una gran influencia en la línea de regresión."
  },
  {
    id: 3,
    idCurso: 1,
    idTema: 1,
    text: "¿Qué sucede con el coeficiente de determinación (R²) cuando se agregan o eliminan puntos en la gráfica?",
    points: 10,
    options: [
      "a) R² siempre aumenta cuando se agregan puntos.",
      "b) R² siempre disminuye cuando se eliminan puntos.",
      "c) R² puede aumentar o disminuir dependiendo de la posición de los puntos añadidos o eliminados.",
      "d) R² no se ve afectado por la adición o eliminación de puntos."
    ],
    correctAnswer: 2,
    attempts: 2,
    feedback: "El coeficiente de determinación (R²) puede aumentar o disminuir según si los puntos añadidos o eliminados refuerzan o debilitan la relación lineal."
  },
  {
    id: 1,
    idCurso: 2,
    idTema: 2,
    text: "¿Cuál es el propósito de la gráfica del codo en el proceso de clustering?",
    points: 10,
    options: [
      "a) Evaluar la homogeneidad de los clusters.",
      "b) Determinar el número óptimo de clusters.",
      "c) Visualizar la dispersión de datos dentro de un cluster.",
      "d) Comparar la distancia entre centroides."
    ],
    correctAnswer: 1,
    attempts: 1,
    feedback: "La gráfica del codo se utiliza para identificar el número óptimo de clusters observando el punto donde la reducción de WCSS comienza a estabilizarse."
  },
  {
    id: 2,
    idCurso: 2,
    idTema: 2,
    text: "¿Qué representa la gráfica de silueta en el contexto del clustering?",
    points: 10,
    options: [
      "a) La variación del WCSS (Within-Cluster Sum of Squares) a medida que se cambian los clusters.",
      "b) La calidad de los clusters basada en la similitud de los puntos dentro del mismo cluster en comparación con otros clusters.",
      "c) La posición de los centroides en relación con los puntos de datos.",
      "d) El número total de puntos en cada cluster."
    ],
    correctAnswer: 1,
    attempts: 1,
    feedback: "La gráfica de silueta mide qué tan bien se agrupan los puntos en su propio cluster en comparación con otros clusters, indicando la calidad del clustering."
  },
  {
    id: 3,
    idCurso: 2,
    idTema: 2,
    text: "En la gráfica del codo, ¿qué se interpreta generalmente cuando el valor del WCSS (Within-Cluster Sum of Squares) alcanza un mínimo absoluto en un punto específico?",
    points: 10,
    options: [
      "a) Se ha encontrado el número óptimo de clusters.",
      "b) Los datos no se pueden agrupar en más de un cluster.",
      "c) Todos los puntos de datos están perfectamente agrupados en un solo cluster.",
      "d) La dispersión dentro de los clusters es máxima."
    ],
    correctAnswer: 0,
    attempts: 2,
    feedback: "Cuando el WCSS alcanza un mínimo absoluto, se ha encontrado el número óptimo de clusters, donde la adición de más clusters no mejora significativamente la agrupación."
  }
];

const Questionnaire = ({ idCurso }) => {
  const filteredQuestions = questions.filter(question => question.idCurso === idCurso);
  
  const [responses, setResponses] = useState(Array(filteredQuestions.length).fill(null));
  const [attemptsLeft, setAttemptsLeft] = useState(filteredQuestions.map(question => question.attempts));
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalFeedback, setModalFeedback] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null); // null, true, or false
  const [attemptsUsed, setAttemptsUsed] = useState(Array(filteredQuestions.length).fill(0));
  const [scored, setScored] = useState(Array(filteredQuestions.length).fill(false)); // Para rastrear si se puntuó correctamente

  const handleAnswerChange = (event) => {
    const { value } = event.target;
    setSelectedOption(parseInt(value));
  };

  const handleSubmit = () => {
    const current = filteredQuestions[currentQuestion];
    const response = selectedOption;
    
    if (response === null) {
      alert("Por favor, selecciona una opción.");
      return;
    }
    
    const isCorrect = response === current.correctAnswer;
    let newAttemptsLeft = [...attemptsLeft];
    let newAttemptsUsed = [...attemptsUsed];
    newAttemptsUsed[currentQuestion] += 1;

    // Si la respuesta es correcta y aún no se ha puntuado para esta pregunta
    if (isCorrect && !scored[currentQuestion]) {
      setIsAnswerCorrect(true);
      setModalMessage("¡Felicidades! Respuesta correcta.");
      setScored(prev => {
        const newScored = [...prev];
        newScored[currentQuestion] = true;
        return newScored;
      });
    } else {
      setIsAnswerCorrect(false); // Respuesta incorrecta
      setModalFeedback(current.feedback);
      newAttemptsLeft[currentQuestion] -= 1;

      if (newAttemptsLeft[currentQuestion] <= 0) {
        setModalMessage(`Intentos agotados. La respuesta correcta es: ${current.options[current.correctAnswer]}.`);
        setResponses(prev => {
          const newResponses = [...prev];
          newResponses[currentQuestion] = response;
          return newResponses;
        });
      } else {
        setModalMessage(`Respuesta incorrecta. Intentos restantes: ${newAttemptsLeft[currentQuestion]}.`);
      }
    }

    setAttemptsLeft(newAttemptsLeft);
    setAttemptsUsed(newAttemptsUsed);
    setShowModal(true);

    if (isCorrect || newAttemptsLeft[currentQuestion] <= 0) {
      if (currentQuestion < filteredQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      } else {
        setFinished(true);
        setModalMessage(`Cuestionario finalizado.`);
      }
    }
  };
  
  const calculateFinalScore = () => {
    return responses.reduce((total, response, index) => {
      if (scored[index]) {
        return total + filteredQuestions[index].points;
      }
      return total;
    }, 0);
  };
  
  return (
    <div className="questionnaire">
      <h1 className="title">Cuestionario</h1>
      {!finished ? (
        <div className="question">
          <h2>Ejercicio {filteredQuestions[currentQuestion].id}</h2>
          <p>{filteredQuestions[currentQuestion].text}</p>
          <p><strong>Puntuación:</strong> {filteredQuestions[currentQuestion].points}</p>
          <div className="options">
            {filteredQuestions[currentQuestion].options.map((option, i) => (
              <div key={i} className="option">
                <input
                  type="radio"
                  id={`q${filteredQuestions[currentQuestion].id}o${i}`}
                  name="option"
                  value={i}
                  checked={selectedOption === i}
                  onChange={handleAnswerChange}
                />
                <label htmlFor={`q${filteredQuestions[currentQuestion].id}o${i}`}>{option}</label>
              </div>
            ))}
          </div>
          <p><strong>Intentos restantes:</strong> {attemptsLeft[currentQuestion]}</p>
          <button onClick={handleSubmit}>Calificar</button>
        </div>
      ) : (
        <div className="final-results">
          <h2>Resultados Finales</h2>
          {filteredQuestions.map((question, index) => (
            <div key={index} className="question">
              <h3>Ejercicio {question.id}</h3>
              <p>{question.text}</p>
              <p><strong>Respuesta dada:</strong> {responses[index] !== null ? question.options[responses[index]] : "No respondida"}</p>
              <p><strong>Respuesta correcta:</strong> {question.options[question.correctAnswer]}</p>
            </div>
          ))}
          <p><strong>Puntuación Total:</strong> {calculateFinalScore()}/{filteredQuestions.length * 10}</p>
        </div>
      )}
      {showModal && (
        <div className="modal-cuestionario">
          <div className="modal-content--cuestionario">
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            <div className="modal-header">
            <p>{modalMessage}</p>
            {isAnswerCorrect ? (
              <img src={successImage} alt="Respuesta correcta" />
            ) : (
              <img src={retryImage} alt="Respuesta incorrecta" />
            )}
            {modalFeedback && <p><strong>Retroalimentación:</strong> {modalFeedback}</p>}
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default Questionnaire;
