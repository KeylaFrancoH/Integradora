import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
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
import graficaInteractiva from "./graficaInteractiva";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const InteractiveChart = ({ initialPoints }) => {
  const [data, setData] = useState(
    Array.isArray(initialPoints) ? initialPoints : []
  );
  useEffect(() => {
    setData(Array.isArray(initialPoints) ? initialPoints : []);
    calculateAndDrawRegression(initialPoints);
    console.log(data);
  }, [initialPoints]);

  const xPoints = [];
  const yPoints = [];

  for (const i in data) {
    xPoints.push(data[i].punto_X);
    yPoints.push(data[i].punto_Y);
  }

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
    if (data.length === 0) {
      return;
    }

    const wordCount = data.map((item) => item["Word count"]);
    const shares = data.map((item) => item["# Shares"]);

    const { slope, intercept, mse, variance, steps } = linearRegression(
      wordCount,
      shares
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
    labels: xPoints,
    datasets: [
      {
        label: "Datos",
        data: yPoints,
        backgroundColor: "blue",
        borderColor: "blue",
        borderWidth: 1,
        fill: false,
        pointRadius: 5,
      },
      {
        label: "Regresión Lineal",
        data: xPoints.map((x) => a * x + b),
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
          text: "X",
        },
      },
      y: {
        title: {
          display: true,
          text: "Y",
        },
      },
    },
  };

  useEffect(() => {
    calculateAndDrawRegression(data);
  }, [data]);

  return (
    <div>
      <h1>Regresión Lineal Interactiva</h1>
      <div>
        <h2>Datos (Editables):</h2>
        {data.map((item, index) => (
          <div key={index}>
            <label>
              Word count:
              <input
                type="number"
                value={item["Word count"]}
                onChange={(e) =>
                  handleDataChange(index, "Word count", e.target.value)
                }
              />
            </label>
            <label>
              # Shares:
              <input
                type="number"
                value={item["# Shares"]}
                onChange={(e) =>
                  handleDataChange(index, "# Shares", e.target.value)
                }
              />
            </label>
            <button onClick={() => removeData(index)}>Eliminar</button>
          </div>
        ))}
        <button onClick={addData}>Agregar Fila</button>
      </div>
      <div>
        <Line data={chartData} options={options} />
      </div>
      <div>
        <p>Pendiente (a): {a.toFixed(2)}</p>
        <p>Intercepto (b): {b.toFixed(2)}</p>
        <p>Error Cuadrado Medio: {mse.toFixed(2)}</p>
        <p>Puntaje de Varianza: {variance.toFixed(2)}</p>
        <h2>Proceso de Regresión Lineal:</h2>
        <ol>
          {regressionSteps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default InteractiveChart;
