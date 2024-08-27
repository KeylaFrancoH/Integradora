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
    const kmeansOptions = {
      maxIterations: numIter,
      nInit: 10,           
  tolerance: 0.0001,   
  init: 'k-means++'  
    };

    const calculateClusters = () => {
      const result = kmeans(exampleData, numClusters, 400);
    
      const clusters = result.clusters;
      const centroids = result.centroids;

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
              label: "Codo",
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

export default KMeansChart;
