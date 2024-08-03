import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title);

const InteractiveChart = ({ initialPoints }) => {
  // Asegurarse de que initialPoints es un array
  const [points, setPoints] = useState(
    Array.isArray(initialPoints) ? initialPoints : []
  );
  console.log(initialPoints);
  useEffect(() => {
    // Actualizar los puntos iniciales cuando cambien
    setPoints(Array.isArray(initialPoints) ? initialPoints : []);
  }, [initialPoints]);

  // Solo mantener los últimos dos puntos
  const recentPoints = points.slice(-2);

  const data = {
    labels: recentPoints.map((point) => point.punto_X),
    datasets: [
      {
        label: "Puntos",
        data: recentPoints.map((point) => point.punto_Y),
        fill: false,
        borderColor: "#00274C",
        tension: 0.1,
        pointRadius: 5,
      },
    ],
  };

  const handleAddPoint = () => {
    const newPoint = {
      idPuntos: points.length + 1,
      punto_X: Math.random() * 100,
      punto_Y: Math.random() * 100,
    };
    setPoints((prevPoints) => [...prevPoints, newPoint]);
  };

  const handleRemovePoint = (id) => {
    setPoints((prevPoints) =>
      prevPoints.filter((point) => point.idPuntos !== id)
    );
  };

  return (
    <div>
      <Line data={data} />
      <button onClick={handleAddPoint}>Agregar Punto</button>
      <div>
        {recentPoints.map((point) => (
          <div key={point.idPuntos}>
            <span>
              X: {point.punto_X.toFixed(2)}, Y: {point.punto_Y.toFixed(2)}
            </span>
            <button onClick={() => handleRemovePoint(point.idPuntos)}>
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InteractiveChart;
