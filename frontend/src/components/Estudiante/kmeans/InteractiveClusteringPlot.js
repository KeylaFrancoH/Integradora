import React, { useState, useMemo } from "react";
import { Scatter, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ScatterController,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  LineElement,
} from "chart.js";
import { FaBookmark } from "react-icons/fa";
import CardEjercicio from "../Extras/CardEjercicio";
import Questionnaire from "../Extras/preguntas";

// Generar datos con blobs
const generateBlobs = (nClusters, nPoints) => {
  const dataPoints = [];
  const centroids = [];
  const colors = Array.from({ length: nClusters }, (_, i) => `hsl(${(i * 360) / nClusters}, 70%, 50%)`);

  for (let i = 0; i < nClusters; i++) {
    const centroid = {
      x: Math.random() * 10,
      y: Math.random() * 10,
      color: colors[i],
    };
    centroids.push(centroid);

    for (let j = 0; j < nPoints / nClusters; j++) {
      const point = {
        x: centroid.x + (Math.random() - 0.5) * 6,  // Ajustar dispersión
        y: centroid.y + (Math.random() - 0.5) * 6,  // Ajustar dispersión
        color: centroid.color,
        borderColor: `hsl(${(i * 360) / nClusters}, 70%, 30%)`, // Colores más oscuros para los bordes
        borderWidth: 1, // Añadir borde
      };
      dataPoints.push(point);
    }
  }

  return { dataPoints, centroids };
};

ChartJS.register(
  ScatterController,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  LineElement
);

const InteractiveClusteringPlot = ({
  instrucciones,
  metodo,
  tema,
  enunciado,
  tituloEjercicio,
  n_iter,
}) => {
  const [param, setParam] = useState(1);
  const [instruccionesD, setInstruccionesD] = useState(instrucciones);
  const [metodoD, setMetodoD] = useState(metodo);
  const [temaD, setTemaD] = useState(tema);
  const [isOpen, setIsOpen] = useState(false);
  const [enunciadoD, setEnunciadoD] = useState(enunciado);
  const [tituloE, setTituloE] = useState(tituloEjercicio);

  const validNIter = Number.isInteger(n_iter) && n_iter > 0 ? n_iter : 400;

  const [nClusters, setNClusters] = useState(4);
  const [nPoints] = useState(100);

  // Generar datos con blobs
  const { dataPoints, centroids } = useMemo(() => generateBlobs(nClusters, nPoints), [nClusters, nPoints]);

  const handleClusterChange = (event) => {
    const newClusterCount = parseInt(event.target.value);
    setNClusters(newClusterCount);
  };

  const clusteringData = {
    datasets: [
      {
        label: "Puntos de Datos",
        data: dataPoints,
        backgroundColor: dataPoints.map(point => point.color),
        borderColor: dataPoints.map(point => point.borderColor),
        borderWidth: 1,
        radius: 6,
      },
      {
        label: "Centroides",
        data: centroids.map(({ x, y, color }) => ({ x, y, backgroundColor: color })),
        backgroundColor: centroids.map(({ color }) => `${color}B0`), // Tono más oscuro
        borderColor: centroids.map(({ color }) => color),
        borderWidth: 3,
        radius: 10, // Aumentar tamaño de centroides
        pointStyle: "circle",
      },
    ],
  };

  const clusteringOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return context.dataset.label === "Centroides"
              ? `Centroides: (${context.raw.x.toFixed(1)}, ${context.raw.y.toFixed(1)})`
              : `Punto de Datos: (${context.raw.x.toFixed(1)}, ${context.raw.y.toFixed(1)})`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Eje X",
        },
      },
      y: {
        title: {
          display: true,
          text: "Eje Y",
        },
      },
    },
  };

  const kValues = Array.from({ length: nClusters }, (_, i) => i + 1);
  const distortions = kValues.map((k) => (10 / k) * Math.random() * param);
  const minDistortion = Math.min(...distortions);
  const startDeclineIndex = distortions.findIndex((d) => d === minDistortion);
  
  // Calcular el índice donde la distorsión comienza a disminuir significativamente
  const significantDeclineIndex = distortions.findIndex((d, i, arr) => {
    if (i === 0 || i === arr.length - 1) return false;
    return d < arr[i - 1] && d < arr[i + 1];
  });

  const elbowData = {
    labels: kValues,
    datasets: [
      {
        label: "Distorsión",
        data: distortions,
        fill: false,
        borderColor: "blue",
        tension: 0.1,
        pointBorderColor: (ctx) =>
          ctx.dataIndex >= significantDeclineIndex ? "orange" : "blue",
        pointBackgroundColor: (ctx) =>
          ctx.dataIndex >= significantDeclineIndex ? "orange" : "blue",
        pointRadius: 7,
      },
    ],
  };

  const elbowOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `Distorsión: ${context.raw.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Número de Clústeres (k)",
        },
      },
      y: {
        title: {
          display: true,
          text: "Distorsión",
        },
      },
    },
  };

  const toggleAccordion = () => setIsOpen(!isOpen);

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

      <div style={{ margin: "20px 0", textAlign: "center" }}>
        <label htmlFor="clusterCount">Número de Clústeres:</label>
        <input
          id="clusterCount"
          type="number"
          value={nClusters}
          min="1"
          onChange={handleClusterChange}
          style={{ marginLeft: "10px", width: "60px" }}
        />
      </div>

      <div style={{ marginTop: "40px" }}>
        <h2>Gráfico de Clustering</h2>
        <div style={{ width: "100%", height: "400px" }}>
          <Scatter data={clusteringData} options={clusteringOptions} />
        </div>
      </div>

      <div style={{ marginTop: "40px", display: "flex" }}>
        <div style={{ width: "50%", paddingRight: "10px" }}>
          <h2>Elbow Method</h2>
          <div style={{ width: "100%", height: "300px" }}>
            <Line data={elbowData} options={elbowOptions} />
          </div>
        </div>
        <div style={{ width: "50%", paddingLeft: "10px" }}>
          <h2>Tabla de Inercia</h2>
          <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>k (Número de Clústeres)</th>
                <th>Distorsión</th>
              </tr>
            </thead>
            <tbody>
              {kValues.map((k, index) => (
                <tr key={k} className={index >= startDeclineIndex ? 'highlight-row' : ''}>
                  <td>{k}</td>
                  <td>{distortions[index].toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <Questionnaire idCurso={2}/>
      </div>
    </div>
  );
};

export default InteractiveClusteringPlot;
