import React, { useState, useMemo, useEffect } from "react";
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
import Papa from 'papaparse';

ChartJS.register(
  ScatterController,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  LineElement
);

const InteractiveClusteringCSV = ({
  instrucciones,
  metodo,
  tema,
  enunciado,
  tituloEjercicio,
  n_iter,
  preguntas,
  preguntaIndex,
  handleAnswer,
  setPreguntaIndex,
  handleSubmit,
}) => {
  const [nClusters, setNClusters] = useState(4);
  const [dataPoints, setDataPoints] = useState([]);
  const [centroids, setCentroids] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [csvData, setCsvData] = useState([]);

  const handleClusterChange = (event) => {
    const newClusterCount = parseInt(event.target.value, 10);
    if (newClusterCount > 0) {
      setNClusters(newClusterCount);
    }
  };

  const handleAccordionToggle = () => {
    setIsOpen(prevState => !prevState);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          setCsvData(results.data);
        },
        error: (error) => {
          console.error("Error al leer el archivo CSV:", error);
        },
      });
    }
  };

  // Procesar datos del CSV y generar blobs
  const processData = (data) => {
    const processedData = data.map(row => ({
      x: parseFloat(row.x),
      y: parseFloat(row.y),
      cluster: parseInt(row.cluster, 10),
      color: row.color || 'gray',
    }));

    const centroids = [];
    // Generar centroides ficticios (puedes modificar esto según tus datos)
    for (let i = 0; i < nClusters; i++) {
      centroids.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: `hsl(${(i * 360) / nClusters}, 70%, 50%)`,
      });
    }

    return { centroids, data: processedData };
  };

  // Actualizar los datos y centroides cuando cambie el número de clusters o el CSV
  useEffect(() => {
    if (csvData.length > 0) {
      const { centroids: generatedCentroids, dataPoints: generatedDataPoints } = processData(csvData);
      setCentroids(generatedCentroids);
      setDataPoints(generatedDataPoints);
    }
  }, [csvData, nClusters]);

  const clusteringData = {
    datasets: [
      {
        label: "Puntos de Datos",
        data: dataPoints || [],
        backgroundColor: (dataPoints || []).map(point => point.color || 'gray'),
        borderColor: (dataPoints || []).map(point => point.color || 'gray'),
        borderWidth: 1,
        radius: 6,
      },
      {
        label: "Centroides",
        data: (centroids || []).map(({ x, y, color }) => ({ x, y, backgroundColor: color || 'gray' })),
        backgroundColor: (centroids || []).map(({ color }) => `${color || 'gray'}B0`),
        borderColor: (centroids || []).map(({ color }) => color || 'gray'),
        borderWidth: 3,
        radius: 10,
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

  // Generar datos para el gráfico del método del codo
  const kValues = Array.from({ length: nClusters }, (_, i) => i + 1);
  const distortions = (kValues || []).map((k) => (10 / k) * Math.random() || 0);
  const minDistortion = Math.min(...(distortions || []));
  const startDeclineIndex = (distortions || []).findIndex((d) => d === minDistortion);

  const significantDeclineIndex = (distortions || []).findIndex((d, i, arr) => {
    if (i === 0 || i === arr.length - 1) return false;
    return d < arr[i - 1] && d < arr[i + 1];
  });

  const elbowData = {
    labels: kValues || [],
    datasets: [
      {
        label: "Distorsión",
        data: distortions || [],
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

  return (
    <div className="scroll-container">
      {instrucciones && (
        <div className="accordion-header" onClick={handleAccordionToggle}>
          <div className="nueva-vista-header">
            <FaBookmark className="nueva-vista-icon" />
            <span>Instrucciones</span>
          </div>
          <div className={`accordion-icon ${isOpen ? "open" : ""}`}>
            {isOpen ? "-" : "+"}
          </div>
        </div>
      )}
      {instrucciones && (
        <div className={`accordion-content ${isOpen ? "open" : ""}`}>
          <p>{instrucciones}</p>
        </div>
      )}
      <h2 style={{ textAlign: "center" }}>{tema}</h2>
      <CardEjercicio titulo={tituloEjercicio} enunciado={enunciado} />

      <div style={{ margin: "20px 0", textAlign: "center" }}>
        <label htmlFor="clusterCount">Número de Clústeres:</label>
        <input
          id="clusterCount"
          type="number"
          value={nClusters}
          min="1"
          onChange={handleClusterChange}
          style={{ marginLeft: "10px", width: "60px", textAlign: "center" }}
        />
      </div>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{ marginBottom: "20px" }}
        />
      </div>

      <div style={{ marginTop: "40px" }}>
        <h2>Datos de Clustering</h2>
        <div style={{ width: "100%", height: "400px" }}>
          <Scatter data={clusteringData} options={clusteringOptions} />
        </div>
      </div>

      <div style={{ marginTop: "40px" }}>
        <h2>Método del Codo</h2>
        <div style={{ width: "100%", height: "400px" }}>
          <Line data={elbowData} options={elbowOptions} />
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Clúster</th>
              <th>Inercia</th>
            </tr>
          </thead>
          <tbody>
            {kValues && kValues.map((k, index) => (
              <tr key={k}>
                <td>{k}</td>
                <td>{distortions[index]?.toFixed(2) || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Questionnaire
        idCurso={2}
      />
    </div>
  );
};

export default InteractiveClusteringCSV;
