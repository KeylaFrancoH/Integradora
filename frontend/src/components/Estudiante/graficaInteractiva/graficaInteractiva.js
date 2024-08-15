import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import MathJax from "react-mathjax";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FaBookmark } from "react-icons/fa";
import * as tf from "@tensorflow/tfjs"; // Importa TensorFlow
import * as sk from "scikitjs"; // Importa scikitjs
import { LinearRegression, metrics } from "scikitjs";
import regression from "regression"; // Asegúrate de importar la librería de regresión correcta
import "./graficaInteractiva.css";
import CardEjercicio from "../Extras/CardEjercicio";
import Questionnaire from "../Extras/preguntas";

// Configura el backend de scikitjs con TensorFlow
sk.setBackend(tf);

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const InteractiveChart = ({
  initialPoints,
  instrucciones,
  formula,
  tema,
  enunciado,
  tituloEjercicio,
}) => {
  const [data, setData] = useState(
    Array.isArray(initialPoints) ? initialPoints : []
  );
  const [instruccionesD, setInstruccionesD] = useState(instrucciones);
  const [isOpen, setIsOpen] = useState(false);
  const [formulaD, setFormulaD] = useState(formula);
  const [temaD, setTemaD] = useState(tema);
  const [enunciadoD, setEnunciadoD] = useState(enunciado);
  const [tituloE, setTituloE] = useState(tituloEjercicio);

  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [mse, setMSE] = useState(0);
  const [mae, setMAE] = useState(0);
  const [rmse, setRMSE] = useState(0);
  const [r2, setR2] = useState(0);
  const [pearson, setPearson] = useState(0);
  const [variance, setVariance] = useState(0);
  const [regressionSteps, setRegressionSteps] = useState([]);

  useEffect(() => {
    if (Array.isArray(initialPoints)) {
      setData(initialPoints);
      calculateAndDrawRegression(initialPoints);
    }
  }, [initialPoints]);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const handleDataChange = (index, key, value) => {
    const updatedData = [...data];
    updatedData[index][key] = Number(value);
    setData(updatedData);
    calculateAndDrawRegression(updatedData);
  };

  const addData = () => {
    setData([...data, { punto_X: 0, punto_Y: 0 }]);
  };

  const removeData = (index) => {
    const updatedData = [...data];
    updatedData.splice(index, 1);
    setData(updatedData);
    calculateAndDrawRegression(updatedData);
  };

  const calculatePearsonCorrelation = (xPoints, yPoints) => {
    const n = xPoints.length;
    const sumX = xPoints.reduce((a, b) => a + b, 0);
    const sumY = yPoints.reduce((a, b) => a + b, 0);
    const sumXY = xPoints.reduce((sum, xi, i) => sum + xi * yPoints[i], 0);
    const sumX2 = xPoints.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = yPoints.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt(
      (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)
    );

    return denominator === 0 ? 0 : numerator / denominator;
  };

  const calculateAndDrawRegression = (data) => {
    if (data.length === 0) return;

    // Convertir los datos a puntos para la regresión
    const points = data.map((item) => [item.punto_X, item.punto_Y]);

    if (points.length === 0) return;

    try {
      // Ajuste del modelo usando la librería 'regression-js'
      const result = regression.linear(points);

      const slope = result.equation[0];
      const intercept = result.equation[1];

      if (slope === undefined || intercept === undefined) {
        throw new Error("Coeficientes del modelo no están definidos.");
      }

      // Predicción de y usando la ecuación de la recta
      const yPred = points.map((point) => slope * point[0] + intercept);

      const yPoints = points.map((point) => point[1]);
      const mse = metrics.meanSquaredError(yPoints, yPred);
      const mae = metrics.meanAbsoluteError(yPoints, yPred);
      const rmse = Math.sqrt(mse);
      const r2 = metrics.r2Score(yPoints, yPred);
      const pearson = calculatePearsonCorrelation(
        points.map((point) => point[0]),
        yPoints
      );

      // Cálculo de la varianza
      const meanY = yPoints.reduce((a, b) => a + b, 0) / yPoints.length;
      const variance =
        yPoints.reduce((acc, y) => acc + Math.pow(y - meanY, 2), 0) /
        yPoints.length;

      // Actualización del estado con los resultados
      setA(slope);
      setB(intercept);
      setMSE(mse);
      setMAE(mae);
      setRMSE(rmse);
      setR2(r2);
      setPearson(pearson);
      setVariance(variance);

      // Preparación de los pasos para la visualización
      const steps = data.map((point, i) => {
        const x = point.punto_X;
        const y = point.punto_Y;
        const yPred = slope * x + intercept;
        return `Paso ${i + 1}: (${x}, ${y}) => Predicción: ${yPred.toFixed(2)}`;
      });
      setRegressionSteps(steps);
    } catch (error) {
      console.error("Error en el cálculo de la regresión:", error);
    }
  };

  const chartData = {
    labels: data.map((d) => d.punto_X),
    datasets: [
      {
        label: "Datos",
        data: data.map((d) => d.punto_Y),
        backgroundColor: "blue",
        borderColor: "blue",
        borderWidth: 0,
        pointRadius: 5,
        showLine: false, // Solo puntos
      },
      {
        label: "Regresión Lineal",
        // Aquí se ajusta la línea de regresión para que cubra todo el rango de los datos
        data: [
          {
            x: Math.min(...data.map((d) => d.punto_X)),
            y: a * Math.min(...data.map((d) => d.punto_X)) + b,
          },
          {
            x: Math.max(...data.map((d) => d.punto_X)),
            y: a * Math.max(...data.map((d) => d.punto_X)) + b,
          },
        ],
        borderColor: "red",
        borderWidth: 2,
        fill: false,
        pointRadius: 0,
        showLine: true,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Punto X",
        },
        ticks: {
          autoSkip: true,
        },
      },
      y: {
        title: {
          display: true,
          text: "Punto Y",
        },
      },
    },
  };

  return (
    <div className="scroll-container">
      {instruccionesD && (
        <div className="accordion-header" onClick={toggleAccordion}>
          <div className="nueva-vista-header">
            <FaBookmark className="nueva-vista-icon" />
            <span>Instrucciones</span>
          </div>
          <div className={`accordion-icon ${isOpen ? "open" : ""}`}>
            {isOpen ? "-" : "+"}
          </div>
        </div>
      )}
      {instruccionesD && (
        <div className={`accordion-content ${isOpen ? "open" : ""}`}>
          <p>{instruccionesD}</p>
        </div>
      )}
      <h2 style={{ textAlign: "center" }}>{temaD}</h2>
      <CardEjercicio titulo={tituloE} enunciado={enunciadoD} />

      <div>
        <div className="graph-container">
          <div className="chart-section">
            <Line data={chartData} options={options} className="chart" />
          </div>
          <div className="data-section">
            <h4>Datos (Editables):</h4>
            <ul>
              {data.map((point, index) => (
                <li key={index} className="data-item">
                  <input
                    type="number"
                    value={point.punto_X}
                    onChange={(e) =>
                      handleDataChange(index, "punto_X", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    value={point.punto_Y}
                    onChange={(e) =>
                      handleDataChange(index, "punto_Y", e.target.value)
                    }
                  />
                  <button onClick={() => removeData(index)}>Eliminar</button>
                </li>
              ))}
            </ul>
            <button onClick={addData}>Agregar Punto</button>
            <div className="results-section">
              <h3>Ecuación de la Recta</h3>
              <MathJax.Provider>
                <MathJax.Node
                  formula={`y = ${a.toFixed(2)}x + ${b.toFixed(2)}`}
                />
              </MathJax.Provider>
              <h3>Evaluación de la Regresión</h3>
              <ul>
                <li>
                  <strong>Coeficiente (a):</strong> {a.toFixed(2)}
                </li>
                <li>
                  <strong>Intercepto (b):</strong> {b.toFixed(2)}
                </li>
                <li>
                  <strong>Mean Squared Error (MSE):</strong> {mse.toFixed(2)}
                </li>
                <li>
                  <strong>Mean Absolute Error (MAE):</strong> {mae.toFixed(2)}
                </li>
                <li>
                  <strong>Root Mean Squared Error (RMSE):</strong>{" "}
                  {rmse.toFixed(2)}
                </li>
                <li>
                  <strong>R² Score:</strong> {r2.toFixed(2)}
                </li>
                <li>
                  <strong>Pearson Correlation:</strong> {pearson.toFixed(2)}
                </li>
                <li>
                  <strong>Variance:</strong> {variance.toFixed(2)}
                </li>
              </ul>
              <h4>Pasos del Ajuste</h4>
              <ul>
                {regressionSteps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveChart;
