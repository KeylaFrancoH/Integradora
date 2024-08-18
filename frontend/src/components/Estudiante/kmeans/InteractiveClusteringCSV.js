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

            // Extrae las columnas que quieres usar para el clustering
            const data = parsedData.map((row) => [
              row.Murder,
              row.Assault,
              row.UrbanPop,
              row.Rape,
            ]);

            // Aplica K-means
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
      <div style={{ marginTop: "30px" }}>
        <h2>Elbow Method</h2>
        <Line
          data={elbowData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
              tooltip: {
                callbacks: {
                  label: function (tooltipItem) {
                    return `K: ${tooltipItem.label}, WCSS: ${tooltipItem.raw}`;
                  },
                },
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Number of Clusters (K)",
                },
                beginAtZero: true,
              },
              y: {
                title: {
                  display: true,
                  text: "WCSS",
                },
                beginAtZero: true,
              },
            },
          }}
        />
      </div>
      <div style={{ marginTop: "30px" }}>
        <h2>Siluette Method</h2>
        <Bar
          data={silhouetteData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
              tooltip: {
                callbacks: {
                  label: function (tooltipItem) {
                    return `K: ${tooltipItem.label}, Silhouette Score: ${tooltipItem.raw}`;
                  },
                },
              },
            },
            indexAxis: "y", // Esto cambia las barras a horizontal
            elements: {
              bar: {
                borderRadius: 15, // Modifica el radio de las puntas de las barras
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Silhouette Score",
                },
                beginAtZero: true,
              },
              y: {
                title: {
                  display: true,
                  text: "Number of Clusters (K)",
                },
                beginAtZero: true,
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default KMeansChart;
