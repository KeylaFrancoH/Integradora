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
import "./graficaInteractiva.css";
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const InteractiveChart = ({ initialPoints, instrucciones, formula, tema}) => {
  const [data, setData] = useState(
    Array.isArray(initialPoints) ? initialPoints : []
  );
  const [instruccionesD, setInstruccionesD] = useState(instrucciones);
  const [isOpen, setIsOpen] = useState(false);
  const [formulaD, setFormulaD] = useState(formula);
  const [temaD, setTemaD] = useState(tema);

  useEffect(() => {
    if (Array.isArray(initialPoints)) {
      setData(initialPoints);
      calculateAndDrawRegression(initialPoints);
    }
  }, [initialPoints]);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [mse, setMSE] = useState(0);
  const [variance, setVariance] = useState(0);
  const [regressionSteps, setRegressionSteps] = useState([]);

  const handleDataChange = (index, key, value) => {
    const updatedData = [...data];
    updatedData[index][key] = Number(value);
    setData(updatedData);
    calculateAndDrawRegression(updatedData);
  };

  const addData = () => {
    setData([...data, { "Word count": 0, "# Shares": 0 }]);
  };

  const removeData = (index) => {
    const updatedData = [...data];
    updatedData.splice(index, 1);
    setData(updatedData);
    calculateAndDrawRegression(updatedData);
  };

  const calculateAndDrawRegression = (data) => {
    if (data.length === 0) return;

    const xPoints = data.map((item) => item.punto_X);
    const yPoints = data.map((item) => item.punto_Y);

    const { slope, intercept, mse, variance, steps } = linearRegression(
      xPoints,
      yPoints
    );

    setA(slope);
    setB(intercept);
    setMSE(mse);
    setVariance(variance);
    setRegressionSteps(steps);
  };

  const linearRegression = (x, y) => {
    const n = x.length;
    const xMean = x.reduce((a, b) => a + b) / n;
    const yMean = y.reduce((a, b) => a + b) / n;

    const ssXX = x.map((xi) => (xi - xMean) ** 2).reduce((a, b) => a + b);
    const ssXY = x
      .map((xi, i) => (xi - xMean) * (y[i] - yMean))
      .reduce((a, b) => a + b);

    const slope = ssXY / ssXX;
    const intercept = yMean - slope * xMean;

    const yPred = x.map((xi) => slope * xi + intercept);
    const mse =
      y.map((yi, i) => (yi - yPred[i]) ** 2).reduce((a, b) => a + b) / n;
    const variance =
      1 - mse / y.map((yi) => (yi - yMean) ** 2).reduce((a, b) => a + b) / n;

    const steps = [];
    for (let i = 0; i < n; i++) {
      const step = `Paso ${i + 1}: (${x[i]}, ${y[i]}) => y = ${slope.toFixed(
        2
      )} * ${x[i]} + ${intercept.toFixed(2)} = ${yPred[i].toFixed(2)}`;
      steps.push(step);
    }

    return { slope, intercept, mse, variance, steps };
  };

  const chartData = {
    labels: data.map((d) => d.punto_X),
    datasets: [
      {
        label: "Datos",
        data: data.map((d) => d.punto_Y),
        backgroundColor: "blue",
        borderColor: "blue",
        borderWidth: 1,
        fill: false,
        pointRadius: 5,
      },
      {
        label: "Regresión Lineal",
        data: data.map((d) => a * d.punto_X + b),
        borderColor: "red",
        borderWidth: 2,
        fill: false,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Word count",
        },
      },
      y: {
        title: {
          display: true,
          text: "# Shares",
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
      <h2 className="ejerciciotitulo">{temaD}</h2>

      <div>
        <div className="graph-container">
          <div className="chart-section">
            <Line data={chartData} options={options} className="chart" />
          </div>
          <div className="data-section">
            <h4>Datos (Editables):</h4>
            <label className="label-formula">
              <MathJax.Provider>
                <MathJax.Node formula={`\\(${formulaD}\\)`} />
              </MathJax.Provider>
            </label>
            <div className="insert-numbers">
              {data.map((item, index) => (
                <div key={index} className="data-item">
                  <label className="label-graph">
                    X:
                    <input
                      className="input-graph"
                      type="number"
                      value={item.punto_X}
                      onChange={(e) =>
                        handleDataChange(index, "punto_X", e.target.value)
                      }
                    />
                  </label>
                  <label className="label-graph">
                    Y:
                    <input
                      className="input-graph"
                      type="number"
                      value={item.punto_Y}
                      onChange={(e) =>
                        handleDataChange(index, "punto_Y", e.target.value)
                      }
                    />
                  </label>
                  <button
                    onClick={() => removeData(index)}
                    className="graph-button"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
              <button onClick={addData} className="add-button">
                Agregar Fila
              </button>
            </div>
            <div className="results-section">
              <p>Pendiente (a): {a.toFixed(2)}</p>
              <p>Intercepto (b): {b.toFixed(2)}</p>
              <p>Error Cuadrado Medio: {mse.toFixed(2)}</p>
              <p>Puntaje de Varianza: {variance.toFixed(2)}</p>
              <h2>Proceso de Regresión Lineal:</h2>
              <ol className="name-pasos">
                {regressionSteps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default InteractiveChart;
