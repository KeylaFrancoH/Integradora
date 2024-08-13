import React, { useState, useEffect } from "react";
import Papa from 'papaparse';
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

  const fetchCSVData = () => {
    const url = "http://localhost:3000/ArchivosEjercicios/crime.csv";
    Papa.parse(url, {
      download: true,
      header: true,
      complete: (results) => {
        setCsvData(results.data);
      },
      error: (error) => {
        console.error("Error al leer el archivo CSV:", error);
      },
    });
  };

  // Función para calcular la distancia euclidiana entre dos puntos
  const euclideanDistance = (point1, point2) => {
    return Math.sqrt(
      Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
    );
  };

  // Función para asignar puntos al clúster más cercano
  const assignPointsToCentroids = (dataPoints, centroids) => {
    return dataPoints.map((point) => {
      let closestCentroid = null;
      let minDistance = Infinity;
      centroids.forEach((centroid) => {
        const distance = euclideanDistance(point, centroid);
        if (distance < minDistance) {
          minDistance = distance;
          closestCentroid = centroid;
        }
      });
      return {
        ...point,
        cluster: closestCentroid ? centroids.indexOf(closestCentroid) : -1,
      };
    });
  };

  // Procesar datos del CSV y generar centroides
  const processData = (data) => {
    const processedData = data.map(row => ({
      x: parseFloat(row.x),
      y: parseFloat(row.y),
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

    const assignedPoints = assignPointsToCentroids(processedData, centroids);
    return { centroids, data: assignedPoints };
  };

  // Llamar a fetchCSVData al montar el componente
  useEffect(() => {
    fetchCSVData();
  }, []);

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
        data: (centroids || []).map(({ x, y, color }) => ({ x, y })),
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

      <div style={{ marginTop: "20px" }}>
        <h2>{tituloEjercicio}</h2>
        <p>{enunciado}</p>
      </div>

      <div style={{ marginTop: "20px" }}>
        <label htmlFor="numClusters">Número de Clústeres:</label>
        <input
          type="number"
          id="numClusters"
          value={nClusters}
          onChange={handleClusterChange}
          min="1"
          max="10"
          style={{ width: "100px", marginLeft: "10px" }}
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
