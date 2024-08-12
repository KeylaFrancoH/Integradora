import React, { useState } from 'react';
import './preguntas.css';

const questions = [
  {
    id: 1,
    idCurso: 1,
    text: "¿Cuál es el objetivo principal de la regresión lineal?",
    points: 10,
    options: [
      "Ajustar una línea que minimice el error entre los datos",
      "Maximizar la precisión del modelo",
      "Predecir la variable dependiente"
    ],
    correctAnswer: 0,
    attempts: 1,
    feedback: "El objetivo principal de la regresión lineal es ajustar una línea que minimice el error entre los datos y la línea ajustada."
  },
  {
    id: 2,
    idCurso: 1,
    text: "¿Qué representa la pendiente (coeficiente) en una ecuación de regresión lineal?",
    points: 10,
    options: [
      "El cambio en la variable dependiente por unidad de cambio en la variable independiente",
      "La intersección en el eje y",
      "La desviación estándar de los datos"
    ],
    correctAnswer: 0,
    attempts: 2,
    feedback: "La pendiente en una ecuación de regresión lineal representa el cambio en la variable dependiente por unidad de cambio en la variable independiente."
  },
  {
    id: 1,
    idCurso: 2,
    text: "¿Cuál es el objetivo principal del algoritmo K-means?",
    points: 10,
    options: [
      "Minimizar la suma de las distancias cuadradas entre los puntos y el centro del cluster",
      "Maximizar la separación entre los clusters",
      "Encontrar la media de todas las variables"
    ],
    correctAnswer: 0,
    attempts: 1,
    feedback: "El objetivo principal del algoritmo K-means es minimizar la suma de las distancias cuadradas entre los puntos y el centro del cluster."
  },
  {
    id: 2,
    idCurso: 2,
    text: "¿Cómo se determina el número de clusters (K) en K-means?",
    points: 10,
    options: [
      "Mediante el método del codo",
      "Utilizando una validación cruzada",
      "Basado en la distancia entre puntos"
    ],
    correctAnswer: 0,
    attempts: 2,
    feedback: "El número de clusters (K) en K-means se determina comúnmente utilizando el método del codo, que busca el punto donde la reducción en la suma de las distancias cuadradas se estabiliza."
  },
  {
    id: 3,
    idCurso: 2,
    text: "¿Qué sucede si el valor de K en K-means es muy alto?",
    points: 10,
    options: [
      "Los clusters pueden ser muy pequeños y específicos, lo que puede llevar al sobreajuste.",
      "Los clusters serán demasiado grandes y poco específicos.",
      "El algoritmo no podrá converger correctamente."
    ],
    correctAnswer: 0,
    attempts: 1,
    feedback: "Si el valor de K es muy alto, los clusters pueden ser muy pequeños y específicos, lo que puede llevar al sobreajuste."
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

    if (response === current.correctAnswer) {
      setModalMessage("¡Felicidades! Respuesta correcta.");
      setResponses(prev => {
        const newResponses = [...prev];
        newResponses[currentQuestion] = response;
        return newResponses;
      });
      if (currentQuestion < filteredQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      } else {
        // Calculate the final score
        const score = responses.reduce((total, response, index) => {
          return response === filteredQuestions[index].correctAnswer ? total + filteredQuestions[index].points : total;
        }, 0) + (response === current.correctAnswer ? current.points : 0);
        setModalMessage(`Cuestionario finalizado.`);
        setFinished(true);
      }
    } else {
      let newAttemptsLeft = [...attemptsLeft];
      newAttemptsLeft[currentQuestion] -= 1;
      setModalFeedback(current.feedback); // Ensure feedback is set here
      if (newAttemptsLeft[currentQuestion] <= 0) {
        setResponses(prev => {
          const newResponses = [...prev];
          newResponses[currentQuestion] = response;
          return newResponses;
        });
        if (currentQuestion < filteredQuestions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedOption(null);
        } else {
          setFinished(true);
          setModalMessage(`Respuesta incorrecta. La respuesta correcta es: ${current.options[current.correctAnswer]}. Cuestionario finalizado.`);
        }
      } else {
        setModalMessage(`Respuesta incorrecta. Intentos restantes: ${newAttemptsLeft[currentQuestion]}.`);
        setAttemptsLeft(newAttemptsLeft);
      }
      setShowModal(true);
    }

    if (response === current.correctAnswer) {
      setShowModal(true);
    }
  };

  const calculateFinalScore = () => {
    return responses.reduce((total, response, index) => {
      return response === filteredQuestions[index].correctAnswer ? total + filteredQuestions[index].points : total;
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
            <p>{modalMessage}</p>
            {modalFeedback && <p><strong>Retroalimentación:</strong> {modalFeedback}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Questionnaire;
