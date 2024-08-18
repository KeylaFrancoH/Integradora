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

// Registra los componentes de Chart.js que vas a usar
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

// Función para calcular la distancia euclidiana
const euclideanDistance = (a, b) =>
  Math.sqrt(a.reduce((acc, val, i) => acc + (val - b[i]) ** 2, 0));

// Función para calcular el coeficiente de silueta
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

// Define colores pastel más fuertes para los clusters
const pastelColors = [
  "#FF8C8C",
  "#FFBF8C",
  "#FFFF8C",
  "#B9FBC0",
  "#A3C2F0",
  "#FF8C8C",
  "#FFC3A0",
  "#B9FBC0",
  "#A3E4D7",
  "#D4A5A5",
];

const KMeansChart = () => {
  const [numClusters, setNumClusters] = useState(3);
  const [barRadius, setBarRadius] = useState(5); // Radio de las puntas
  const [chartData, setChartData] = useState({ datasets: [] });
  const [elbowData, setElbowData] = useState({ labels: [], datasets: [] });
  const [silhouetteData, setSilhouetteData] = useState({
    labels: [],
    datasets: [],
  });

  // Datos de ejemplo (los datos ya están definidos en lugar de cargarse desde un archivo)
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

  useEffect(() => {
    const calculateClusters = () => {
      // Aplica K-means
      const result = kmeans(exampleData, numClusters);
      const clusters = result.clusters;
      const centroids = result.centroids;

      const colors = pastelColors.slice(0, numClusters);

      const clusterData = exampleData.map((point, index) => ({
        x: point[0],
        y: point[1],
        backgroundColor: colors[clusters[index]],
        borderColor: colors[clusters[index]],
        borderWidth: 1,
        pointRadius: 8, // Tamaño de los puntos de los clusters
      }));

      const centroidData = centroids.map((centroid, index) => ({
        x: centroid[0],
        y: centroid[1],
        backgroundColor: colors[index],
        borderColor: "#000000", // Borde negro para los centroides
        borderWidth: 3, // Borde grueso para los centroides
        pointRadius: 12, // Tamaño ajustado para los centroides
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
            borderWidth: 3, // Borde negro grueso
            pointRadius: 12, // Tamaño ajustado para los centroides
          },
        ],
      });

      const calculateMetrics = () => {
        const elbowX = [];
        const elbowY = [];
        const silhouetteX = [];
        const silhouetteY = [];

        for (let k = 1; k <= numClusters; k++) {
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

        // Ordenar y actualizar los datos de silueta en orden descendente
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
              borderColor: reversedSilhouetteX.map((k) => pastelColors[k - 1]),
              borderWidth: 1,
            },
          ],
        });
      };

      calculateMetrics();
    };

    calculateClusters();
  }, [numClusters]);

  return (
    <div>
      <h2>K-means Clustering Visualization</h2>
      <label htmlFor="numClusters">Number of Clusters:</label>
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
      <div style={{ marginTop: "20px" }}>
        <label htmlFor="barRadius">Bar Radius:</label>
        <input
          id="barRadius"
          type="range"
          min="0"
          max="20"
          value={barRadius}
          onChange={(e) => setBarRadius(Number(e.target.value))}
          style={{ marginBottom: "20px", display: "block" }}
        />
        <span>{barRadius}px</span>
      </div>
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
      <h2>Elbow Method</h2>
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
      <h2>Silhouette Scores</h2>
      <Bar
        data={silhouetteData}
        options={{
          indexAxis: "y", // Cambia la dirección de la barra a horizontal
          responsive: true,
          scales: {
            x: {
              beginAtZero: true,
            },
            y: {
              beginAtZero: true,
            },
          },
          elements: {
            bar: {
              borderRadius: barRadius, // Aplica el radio a las puntas de las barras
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
  );
};

export default KMeansChart;
