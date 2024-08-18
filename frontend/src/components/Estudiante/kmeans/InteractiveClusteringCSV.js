import React, { useState, useEffect } from "react";
import { Scatter, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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

const KMeansChart = () => {
  const [numClusters, setNumClusters] = useState(3);
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

            const colors = Array.from(
              { length: numClusters },
              (_, i) => `hsl(${i * (360 / numClusters)}, 100%, 50%)`
            );

            const clusterData = data.map((point, index) => ({
              x: point[0],
              y: point[1],
              backgroundColor: colors[clusters[index]],
              borderColor: colors[clusters[index]],
              borderWidth: 1,
            }));

            const centroidData = centroids.map((centroid, index) => ({
              x: centroid[0],
              y: centroid[1],
              backgroundColor: colors[index],
              borderColor: colors[index],
              borderWidth: 2,
              pointRadius: 10,
            }));

            setChartData({
              datasets: [
                {
                  label: "Clusters",
                  data: clusterData,
                  backgroundColor: clusterData.map((d) => d.backgroundColor),
                  borderColor: clusterData.map((d) => d.borderColor),
                  borderWidth: 1,
                },
                {
                  label: "Centroids",
                  data: centroidData,
                  backgroundColor: centroidData.map((d) => d.backgroundColor),
                  borderColor: centroidData.map((d) => d.borderColor),
                  borderWidth: 1,
                },
              ],
            });

            const calculateMetrics = () => {
              const elbowX = [];
              const elbowY = [];
              const silhouetteX = [];
              const silhouetteY = [];

              for (let k = 1; k <= 10; k++) {
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
                    borderColor: "rgba(75,192,192,1)",
                    tension: 0.1,
                  },
                ],
              });

              setSilhouetteData({
                labels: silhouetteX,
                datasets: [
                  {
                    label: "Silhouette Score",
                    data: silhouetteY,
                    fill: false,
                    borderColor: "rgba(75,192,192,1)",
                    tension: 0.1,
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
        <h2>Silhouette Score</h2>
        <Line
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
                  text: "Silhouette Score",
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
