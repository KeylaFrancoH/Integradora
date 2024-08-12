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
}) => {
  const [param, setParam] = useState(1);
  const [instruccionesD, setInstruccionesD] = useState(instrucciones);
  const [metodoD, setMetodoD] = useState(metodo);
  const [temaD, setTemaD] = useState(tema);
  const [isOpen, setIsOpen] = useState(false);
  const [enunciadoD, setEnunciadoD] = useState(enunciado);
  const [tituloE, setTituloE] = useState(tituloEjercicio);

  const {
    kValues,
    distortions,
    centroids,
    dataPoints,
    optimalPointIndex,
    elbowPointIndex,
  } = useMemo(() => {
    const kValues = Array.from({ length: 10 }, (_, i) => i + 1);
    const distortions = kValues.map((k) =>
      param > 0 ? (10 / k) * Math.random() * param : 0
    );

    const minDistortion = Math.min(...distortions);
    const optimalPointIndex = distortions.indexOf(minDistortion);

    const elbowPointIndex = distortions
      .slice(1)
      .reduce(
        (minIndex, d, i) =>
          d - distortions[i] < distortions[minIndex] - distortions[minIndex - 1]
            ? i + 1
            : minIndex,
        1
      );

    const centroids = kValues.map((k) => ({
      x: k,
      y: (10 / k) * Math.random() * param,
    }));

    const dataPoints = kValues.flatMap((k) =>
      Array.from({ length: 5 }, () => ({
        x: k + (Math.random() - 0.5),
        y: (10 / k) * Math.random() * param + (Math.random() - 0.5),
      }))
    );

    return {
      kValues,
      distortions,
      centroids,
      dataPoints,
      optimalPointIndex,
      elbowPointIndex,
    };
  }, [param]);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };
  // Configuración del gráfico de centroides y puntos de datos
  const clusteringData = {
    datasets: [
      {
        label: "Puntos de Datos",
        data: dataPoints,
        backgroundColor: "lightblue",
        borderColor: "blue",
        borderWidth: 2,
        radius: 5,
      },
      {
        label: "Centroides",
        data: centroids,
        backgroundColor: (ctx) =>
          ctx.dataIndex === optimalPointIndex ? "green" : "red",
        borderColor: "darkred",
        borderWidth: 3,
        radius: 7,
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
              ? `Centroides: (${context.raw.x.toFixed(
                  1
                )}, ${context.raw.y.toFixed(1)})`
              : `Punto de Datos: (${context.raw.x.toFixed(
                  1
                )}, ${context.raw.y.toFixed(1)})`;
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
          text: "Valor",
        },
      },
    },
  };

  // Datos y opciones para la gráfica de codo
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
          ctx.dataIndex === elbowPointIndex ? "orange" : "blue",
        pointBackgroundColor: (ctx) =>
          ctx.dataIndex === elbowPointIndex ? "orange" : "blue",
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
      <CardEjercicio titulo={tituloE} enunciado={enunciadoD}/>
      <div className="graphics" style={{ width: "50%", display: "flex" }}>
        <Line data={elbowData} options={elbowOptions} />
        <Scatter data={clusteringData} options={clusteringOptions} />
      </div>

      <div style={{ marginTop: "20px" }}>
        <label htmlFor="param">Ajustar Parámetro:</label>
        <input
          id="param"
          type="range"
          min="1"
          max="10"
          step="1"
          value={param}
          onChange={(e) => setParam(parseFloat(e.target.value))}
          style={{ marginLeft: "10px" }}
        />
        <span>{param.toFixed(1)}</span>
      </div>

      <h2 style={{ marginTop: "40px" }}>Tabla de Inercias</h2>
      <table
        style={{
          width: "80%",
          margin: "20px auto",
          borderCollapse: "collapse",
          fontFamily: "Roboto, sans-serif",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f5f5f5", color: "#333" }}>
            <th
              style={{
                borderBottom: "2px solid #ddd",
                padding: "12px 15px",
                textAlign: "left",
                fontWeight: "600",
              }}
            >
              Número de Clústeres (k)
            </th>
            <th
              style={{
                borderBottom: "2px solid #ddd",
                padding: "12px 15px",
                textAlign: "left",
                fontWeight: "600",
              }}
            >
              Inercia (Distorsión)
            </th>
          </tr>
        </thead>
        <tbody>
          {kValues.map((k, index) => (
            <tr
              key={k}
              style={{
                backgroundColor:
                  index === elbowPointIndex ? "#eaeaea" : "transparent",
                transition: "background-color 0.3s ease",
              }}
            >
              <td
                style={{
                  borderBottom: "1px solid #ddd",
                  padding: "10px 15px",
                }}
              >
                {k}
              </td>
              <td
                style={{
                  borderBottom: "1px solid #ddd",
                  padding: "10px 15px",
                }}
              >
                {distortions[index].toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InteractiveClusteringPlot;
