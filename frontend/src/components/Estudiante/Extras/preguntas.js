import React, { useState } from 'react';
import './preguntas.css';

const questions = [
  {
    id: 1,
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
  }
];

const Questionnaire = () => {
  const [responses, setResponses] = useState(Array(questions.length).fill(null));
  const [attemptsLeft, setAttemptsLeft] = useState(questions.map(question => question.attempts));
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
    const current = questions[currentQuestion];
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
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      } else {
        // Calculate the final score
        const score = responses.reduce((total, response, index) => {
          return response === questions[index].correctAnswer ? total + questions[index].points : total;
        }, 0) + (response === current.correctAnswer ? current.points : 0);
        setModalMessage(`Cuestionario finalizado.`);
        setFinished(true);
      }
    } else {
      let newAttemptsLeft = [...attemptsLeft];
      newAttemptsLeft[currentQuestion] -= 1;
      if (newAttemptsLeft[currentQuestion] <= 0) {
        setResponses(prev => {
          const newResponses = [...prev];
          newResponses[currentQuestion] = response;
          return newResponses;
        });
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedOption(null);
        } else {
          setFinished(true);
          setModalMessage(`Respuesta incorrecta. La respuesta correcta es: ${current.options[current.correctAnswer]}. Cuestionario finalizado.`);
        }
      } else {
        setModalMessage(`Respuesta incorrecta. Intentos restantes: ${newAttemptsLeft[currentQuestion]}.`);
        setModalFeedback(current.feedback); // Update modal feedback
        setAttemptsLeft(newAttemptsLeft);
      }
    }

    setShowModal(true);
  };

  const handleNextQuestion = () => {
    setShowModal(false);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const calculateFinalScore = () => {
    return responses.reduce((total, response, index) => {
      return response === questions[index].correctAnswer ? total + questions[index].points : total;
    }, 0);
  };

  return (
    <div className="questionnaire">
      <h1 className="title">Cuestionario</h1>
      {!finished ? (
        <div className="question">
          <h2>Ejercicio {questions[currentQuestion].id}</h2>
          <p>{questions[currentQuestion].text}</p>
          <p><strong>Puntuación:</strong> {questions[currentQuestion].points}</p>
          <div className="options">
            {questions[currentQuestion].options.map((option, i) => (
              <div key={i} className="option">
                <input
                  type="radio"
                  id={`q${questions[currentQuestion].id}o${i}`}
                  name="option"
                  value={i}
                  checked={selectedOption === i}
                  onChange={handleAnswerChange}
                />
                <label htmlFor={`q${questions[currentQuestion].id}o${i}`}>{option}</label>
              </div>
            ))}
          </div>
          <p><strong>Intentos restantes:</strong> {attemptsLeft[currentQuestion]}</p>
          <button onClick={handleSubmit}>Calificar</button>
          {questions[currentQuestion].attempts > 1 && !finished && currentQuestion < questions.length - 1 && (
            <button onClick={() => setCurrentQuestion(currentQuestion + 1)}>Siguiente Pregunta</button>
          )}
        </div>
      ) : (
        <div className="final-results">
          <h2>Resultados Finales</h2>
          {questions.map((question, index) => (
            <div key={index} className="question">
              <h3>Ejercicio {question.id}</h3>
              <p>{question.text}</p>
              <p><strong>Respuesta dada:</strong> {responses[index] !== null ? question.options[responses[index]] : "No respondida"}</p>
              <p><strong>Respuesta correcta:</strong> {question.options[question.correctAnswer]}</p>
            </div>
          ))}
          <p><strong>Puntuación Total:</strong> {calculateFinalScore()}/{questions.length * 10}</p>
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
