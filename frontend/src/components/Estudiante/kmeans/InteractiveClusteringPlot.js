import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { kmeans } from "ml-kmeans";
import React, { useEffect, useState } from "react";
import { Bar, Line, Scatter } from "react-chartjs-2";
import { FaBookmark } from "react-icons/fa";
import CardEjercicio from "../Extras/Ejercicios/CardEjercicio";
import Questionnaire from "../Extras/Preguntas/preguntas";
import Accordion from "../Extras/Instrucciones/Acordion";
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

const KMeansChart = ({
  instrucciones,
  metodo,
  tema,
  enunciado,
  tituloEjercicio,
}) => {
  const [instruccionesD, setInstruccionesD] = useState(instrucciones);
  const [metodoD, setMetodoD] = useState(metodo);
  const [temaD, setTemaD] = useState(tema);
  const [isOpen, setIsOpen] = useState(false);
  const [enunciadoD, setEnunciadoD] = useState(enunciado);
  const [tituloE, setTituloE] = useState(tituloEjercicio);

  const [numClusters, setNumClusters] = useState(3);
  const [numIter, setNumIter] = useState(400);
  const [chartData, setChartData] = useState({ datasets: [] });
  const [elbowData, setElbowData] = useState({ labels: [], datasets: [] });
  const [silhouetteData, setSilhouetteData] = useState({
    labels: [],
    datasets: [],
  });
  const [averageSilhouetteScore, setAverageSilhouetteScore] = useState(0);
  const [kmeansResult, setKmeansResult] = useState(null);
  const exampleData = [
    [178, 90, 237, 14],
    [223, 150, 61, 72],
    [80, 119, 171, 102],
    [142, 11, 204, 44],
    [199, 200, 143, 120],
    [239, 27, 173, 229],
    [165, 77, 12, 49],
    [219, 117, 209, 35],
    [208, 129, 85, 131],
    [181, 64, 187, 150],
    [118, 221, 233, 66],
    [97, 170, 115, 41],
    [206, 212, 8, 215],
    [225, 52, 73, 88],
    [65, 106, 132, 137],
    [154, 135, 219, 204],
    [194, 187, 19, 181],
    [172, 239, 195, 188],
    [58, 202, 3, 213],
    [113, 236, 105, 149],
    [88, 47, 193, 117],
    [230, 161, 36, 190],
    [93, 84, 68, 103],
    [109, 241, 46, 228],
  ];
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
        ) /
        (clusterPoints.length - 1);

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

    return silhouetteScores;
  };

  useEffect(() => {
    const kmeansOptions = {
      seed: 0,
      maxIterations: numIter,
      nInit: 10,
      tolerance: 0.0001,
      init: "k-means++",
    };

    const calculateClusters = () => {
      const result = kmeans(exampleData, numClusters, 400);

      const clusters = result.clusters;
      const centroids = result.centroids;
      const silhouetteScores = silhouetteScore(
        exampleData,
        clusters,
        centroids
      );
      const colors = pastelColors.slice(0, numClusters);

      const clusterData = exampleData.map((point, index) => ({
        x: point[0],
        y: point[1],
        backgroundColor: colors[clusters[index]],
        borderColor: colors[clusters[index]],
        borderWidth: 1,
        pointRadius: 8,
      }));

      const centroidData = centroids.map((centroid, index) => ({
        x: centroid[0],
        y: centroid[1],
        backgroundColor: colors[index],
        borderColor: "#000000",
        borderWidth: 2,
        pointRadius: 12,
      }));

      setChartData({
        datasets: [
          {
            label: "Clusters",
            data: clusterData,
            backgroundColor: clusterData.map((d) => d.backgroundColor),
            borderColor: clusterData.map((d) => d.borderColor),
            borderWidth: 1,
            pointRadius: 5,
          },
          {
            label: "Centroids",
            data: centroidData,
            backgroundColor: centroidData.map((d) => d.backgroundColor),
            borderColor: centroidData.map((d) => d.borderColor),
            borderWidth: 3,
            pointRadius: 8,
          },
        ],
      });

      const calculateMetrics = () => {
        const elbowX = [];
        const elbowY = [];
        const silhouetteX = [];
        const silhouetteY = [];

        let totalSilhouetteScore = 0;
        let totalDataPoints = 0;

        for (let k = 2; k <= numClusters; k++) {
          const result = kmeans(exampleData, k);
          const clusters = result.clusters;
          const centroids = result.centroids;

          const distances = exampleData.map((point, index) => {
            const centroid = centroids[clusters[index]];
            return euclideanDistance(point, centroid);
          });

          const wcss = distances.reduce((acc, dist) => acc + dist ** 2, 0);
          elbowX.push(k);
          elbowY.push(wcss);

          const silhouette = silhouetteScore(exampleData, clusters, centroids);

          totalSilhouetteScore += silhouette.reduce((acc, val) => acc + val, 0);
          totalDataPoints += silhouette.length;

          silhouetteX.push(k);
          silhouetteY.push(
            silhouette.reduce((acc, val) => acc + val, 0) / silhouette.length
          );
        }
        const avgSilhouette = totalSilhouetteScore / totalDataPoints;
        setAverageSilhouetteScore(avgSilhouette);

        setElbowData({
          labels: elbowX,
          datasets: [
            {
              label: "Codo",
              data: elbowY,
              fill: false,
              borderColor: "#FF6F61",
              tension: 0.1,
            },
          ],
        });
        const averageSilhouetteScores = Array(numClusters)
          .fill(0)
          .map((_, i) => {
            const clusterScores = silhouetteScores.filter(
              (_, idx) => clusters[idx] === i
            );
            const sum = clusterScores.reduce((a, b) => a + b, 0);
            return clusterScores.length > 0 ? sum / clusterScores.length : 0;
          });

        let silhouetteByCluster = [];
        for (let i = 0; i < numClusters; i++) {
          silhouetteByCluster[i] = silhouetteScores
            .filter((_, idx) => clusters[idx] === i)
            .sort((a, b) => b - a);
        }

        setSilhouetteData({
          labels: [...Array(numClusters).keys()],
          datasets: [
            {
              label: "Average Silhouette Score",
              data: averageSilhouetteScores,
              backgroundColor: pastelColors.slice(0, numClusters),
              borderColor: pastelColors.slice(0, numClusters),
              borderWidth: 1,
            },
          ],
        });
      };

      calculateMetrics();
    };

    calculateClusters();
  }, [numClusters]);

  const toggleAccordion = () => setIsOpen(!isOpen);

  return (
    <div className="scroll-container">
      <Accordion instrucciones={instruccionesD} />
      <h2 style={{ textAlign: "center" }}>{temaD}</h2>
      <CardEjercicio titulo={tituloE} enunciado={enunciadoD} />
      <div className="k-means-container">
        <div className="num-clus">
          <label htmlFor="numClusters">Número de Clusters:</label>
          <input
            id="numClusters"
            type="range"
            min="2"
            max="10"
            value={numClusters}
            onChange={(e) => setNumClusters(Number(e.target.value))}
            style={{ marginBottom: "20px" }}
          />
          <span>{numClusters}</span>
        </div>
      </div>
      <div className="elbow-chart ">
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
                  title: {
                    display: true,
                    text: "Silhouette Score",
                  },
                },
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Cluster Label",
                  },

                  reverse: true,
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
          />
          <p style={{ textAlign: "center" }}>
            Average Silhouette Score: {averageSilhouetteScore.toFixed(2)}
          </p>
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

export default KMeansChart;
