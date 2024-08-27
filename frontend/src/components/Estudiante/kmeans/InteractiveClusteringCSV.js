import React, { useState, useEffect } from "react";
import { Scatter, Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { kmeans } from "ml-kmeans";
import Papa from "papaparse";
import { FaBookmark } from "react-icons/fa";
import CardEjercicio from "../Extras/CardEjercicio";
import Questionnaire from "../Extras/preguntas";
import "./InteractiveClusteringPlot.css";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

const euclideanDistance = (a, b) =>
  Math.sqrt(a.reduce((acc, val, i) => acc + (val - b[i]) ** 2, 0));

const silhouetteScore = (data, clusters, centroids) => {
  const n = data.length;
  const clusterCount = centroids.length;

  const silhouetteScores = new Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    const clusterIndex = clusters[i];
    const clusterPoints = data.filter(
      (_, idx) => clusters[idx] === clusterIndex
    );

    const a =
      clusterPoints.reduce(
        (sum, point) => sum + euclideanDistance(data[i], point),
        0
      ) / clusterPoints.length;

    let minB = Infinity;
    for (let j = 0; j < clusterCount; j++) {
      if (j === clusterIndex) continue;
      const otherClusterPoints = data.filter((_, idx) => clusters[idx] === j);
      const b =
        otherClusterPoints.reduce(
          (sum, point) => sum + euclideanDistance(data[i], point),
          0
        ) / otherClusterPoints.length;
      if (b < minB) minB = b;
    }

    silhouetteScores[i] = (minB - a) / Math.max(a, minB);
  }

  return silhouetteScores.reduce((sum, score) => sum + score, 0) / n;
};

const pastelColors = [
  "#FFCC00",
  "#0066CC",
  "#CC3333",
  "#33CC33",
  "#9933CC",
  "#FF6633",
  "#669999",
  "#FF99CC",
  "#CCCC33",
  "#3366FF",
];

const InteractiveClusteringCSV = ({
  instrucciones,
  metodo,
  tema,
  enunciado,
  tituloEjercicio,
  num_Clusters,
}) => {
  const [instruccionesD, setInstruccionesD] = useState(instrucciones);
  const [metodoD, setMetodoD] = useState(metodo);
  const [temaD, setTemaD] = useState(tema);
  const [isOpen, setIsOpen] = useState(false);
  const [enunciadoD, setEnunciadoD] = useState(enunciado);
  const [tituloE, setTituloE] = useState(tituloEjercicio);

  const [numClusters, setNumClusters] = useState(num_Clusters || 4);
  const [chartData, setChartData] = useState({ datasets: [] });
  const [elbowData, setElbowData] = useState({ labels: [], datasets: [] });
  const [silhouetteData, setSilhouetteData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/ArchivosEjercicios/crime.csv"
        );
        const csvData = await response.text();
        Papa.parse(csvData, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            const parsedData = results.data;

            const data = parsedData.map((row) => [
              row.Murder,
              row.Assault,
              row.UrbanPop,
              row.Rape,
            ]);

            const result = kmeans(data, numClusters);
            const clusters = result.clusters;
            const centroids = result.centroids;

            const colors = pastelColors.slice(0, numClusters);

            const clusterData = data.map((point, index) => ({
              x: point[0],
              y: point[1],
              backgroundColor: colors[clusters[index]],
              borderColor: colors[clusters[index]],
              borderWidth: 1,
              pointRadius: 5,
            }));

            const centroidData = centroids.map((centroid, index) => ({
              x: centroid[0],
              y: centroid[1],
              backgroundColor: colors[index],
              borderColor: "#000000",
              borderWidth: 2,
              pointRadius: 8,
            }));

            setChartData({
              datasets: [
                {
                  label: "Clusters",
                  data: clusterData,
                  backgroundColor: clusterData.map((d) => d.backgroundColor),
                  borderColor: clusterData.map((d) => d.borderColor),
                  borderWidth: 1,
                  pointRadius: 8,
                },
                {
                  label: "Centroids",
                  data: centroidData,
                  backgroundColor: centroidData.map((d) => d.backgroundColor),
                  borderColor: centroidData.map((d) => d.borderColor),
                  borderWidth: 3,
                  pointRadius: 12,
                },
              ],
            });

            const calculateMetrics = () => {
              const elbowX = [];
              const elbowY = [];
              const silhouetteX = [];
              const silhouetteY = [];

              for (let k = 1; k <= numClusters; k++) {
                const result = kmeans(data, k);
                const clusters = result.clusters;
                const centroids = result.centroids;

                const distances = data.map((point, index) => {
                  const centroid = centroids[clusters[index]];
                  return euclideanDistance(point, centroid);
                });

                const wcss = distances.reduce(
                  (acc, dist) => acc + dist ** 2,
                  0
                );
                elbowX.push(k);
                elbowY.push(wcss);

                const silhouette = silhouetteScore(data, clusters, centroids);
                silhouetteX.push(k);
                silhouetteY.push(silhouette);
              }

              setElbowData({
                labels: elbowX,
                datasets: [
                  {
                    label: "WCSS",
                    data: elbowY,
                    fill: false,
                    borderColor: "#FF6F61",
                    tension: 0.1,
                  },
                ],
              });

              const reversedSilhouetteX = silhouetteX.slice().reverse();
              const reversedSilhouetteY = silhouetteY.slice().reverse();

              setSilhouetteData({
                labels: reversedSilhouetteX,
                datasets: [
                  {
                    label: "Silhouette Score",
                    data: reversedSilhouetteY,
                    backgroundColor: reversedSilhouetteX.map(
                      (k) => pastelColors[k - 1]
                    ),
                    borderColor: reversedSilhouetteX.map(
                      (k) => pastelColors[k - 1]
                    ),
                    borderWidth: 1,
                  },
                ],
              });
            };

            calculateMetrics();
          },
        });
      } catch (error) {
        console.error("Error fetching or parsing CSV:", error);
      }
    };

    fetchData();
  }, [numClusters]);

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
      <div className="k-means-container">
        <div className="num-clus">
          <label htmlFor="numClusters">Número de Clusters:</label>
          <input
            id="numClusters"
            type="range"
            min="1"
            max="10"
            value={numClusters}
            onChange={(e) => setNumClusters(Number(e.target.value))}
            style={{ marginBottom: "20px" }}
          />
          <span>{numClusters}</span>
        </div>
      </div>
      <div className="elbow-chart " style={{ width: "60%", height: "30%" }}>
        <h2>Método del codo</h2>
        <Line
          data={elbowData}
          options={{
            responsive: true,
            scales: {
              x: {
                beginAtZero: true,
              },
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      </div>
      <hr className="divider" />

      <div style={{ marginTop: "20px" }} className="graficasK">
        <div className="silhouette">
          <h2>Gráfica de silueta</h2>
          <Bar
            data={silhouetteData}
            options={{
              indexAxis: "y",
              responsive: true,
              scales: {
                x: {
                  beginAtZero: true,
                },
                y: {
                  beginAtZero: true,
                },
              },

              plugins: {
                legend: {
                  position: "top",
                },
                tooltip: {
                  callbacks: {
                    label: function (tooltipItem) {
                      return `Score: ${tooltipItem.raw}`;
                    },
                  },
                },
              },
            }}
          />
        </div>
        <div className="k-means">
          <h2>Gráfica K-means</h2>
          <Scatter
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                tooltip: {
                  callbacks: {
                    label: function (tooltipItem) {
                      return `(${tooltipItem.raw.x}, ${tooltipItem.raw.y})`;
                    },
                  },
                },
              },
              scales: {
                x: {
                  beginAtZero: true,
                },
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </div>
      <hr className="divider" />
      <div style={{ marginTop: "20px" }}>
        <Questionnaire idCurso={2} />
      </div>
    </div>
  );
};

export default InteractiveClusteringCSV;
