// src/components/InteractiveClusteringPlot.js
import React, { useState, useMemo } from 'react';
import { Scatter, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ScatterController, PointElement, CategoryScale, LinearScale, Tooltip, Legend, LineElement } from 'chart.js';

// Register necessary components in Chart.js
ChartJS.register(ScatterController, PointElement, CategoryScale, LinearScale, Tooltip, Legend, LineElement);

const InteractiveClusteringPlot = () => {
  const [param, setParam] = useState(1);

  // Usa useMemo para memorizar los datos generados
  const { kValues, distortions, centroids, dataPoints, optimalPointIndex, elbowPointIndex } = useMemo(() => {
    const kValues = Array.from({ length: 10 }, (_, i) => i + 1);
    const distortions = kValues.map(k => (param > 0 ? (10 / k) * Math.random() * param : 0));

    // Encuentra el índice del punto óptimo (donde la distorsión es mínima)
    const minDistortion = Math.min(...distortions);
    const optimalPointIndex = distortions.indexOf(minDistortion);

    // Encuentra el índice del codo (donde la disminución comienza a desacelerarse)
    const elbowPointIndex = distortions.slice(1).reduce((minIndex, d, i) => 
      d - distortions[i] < distortions[minIndex] - distortions[minIndex - 1] ? i + 1 : minIndex
    , 1);

    // Genera centroides y puntos de datos para ilustrar
    const centroids = kValues.map(k => ({
      x: k,
      y: (10 / k) * Math.random() * param
    }));

    const dataPoints = kValues.flatMap(k => 
      Array.from({ length: 5 }, () => ({
        x: k + (Math.random() - 0.5),
        y: (10 / k) * Math.random() * param + (Math.random() - 0.5)
      }))
    );

    return { kValues, distortions, centroids, dataPoints, optimalPointIndex, elbowPointIndex };
  }, [param]);

  // Configuración del gráfico de centroides y puntos de datos
  const clusteringData = {
    datasets: [
      {
        label: 'Puntos de Datos',
        data: dataPoints,
        backgroundColor: 'lightblue',
        borderColor: 'blue',
        borderWidth: 2,
        radius: 5
      },
      {
        label: 'Centroides',
        data: centroids,
        backgroundColor: (ctx) => ctx.dataIndex === optimalPointIndex ? 'green' : 'red',
        borderColor: 'darkred',
        borderWidth: 3,
        radius: 7,
        pointStyle: 'circle'
      }
    ]
  };

  const clusteringOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return context.dataset.label === 'Centroides'
              ? `Centroides: (${context.raw.x.toFixed(1)}, ${context.raw.y.toFixed(1)})`
              : `Punto de Datos: (${context.raw.x.toFixed(1)}, ${context.raw.y.toFixed(1)})`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Número de Clústeres (k)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Valor'
        }
      }
    }
  };

  // Datos y opciones para la gráfica de codo
  const elbowData = {
    labels: kValues,
    datasets: [
      {
        label: 'Distorsión',
        data: distortions,
        fill: false,
        borderColor: 'blue',
        tension: 0.1,
        pointBorderColor: (ctx) => ctx.dataIndex === elbowPointIndex ? 'orange' : 'blue',
        pointBackgroundColor: (ctx) => ctx.dataIndex === elbowPointIndex ? 'orange' : 'blue',
        pointRadius: 7
      }
    ]
  };

  const elbowOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `Distorsión: ${context.raw.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Número de Clústeres (k)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Distorsión'
        }
      }
    }
  };

  return (
    <div className='scroll-container'>
      <h1>Visualización Interactiva de Clustering</h1>

      <Scatter data={clusteringData} options={clusteringOptions} />

      <div style={{ marginTop: '20px' }}>
        <label htmlFor="param">Ajustar Parámetro:</label>
        <input
          id="param"
          type="range"
          min="1"
          max="10"
          step="0.1"
          value={param}
          onChange={(e) => setParam(parseFloat(e.target.value))}
          style={{ marginLeft: '10px' }}
        />
        <span>{param.toFixed(1)}</span>
      </div>

      <h2 style={{ marginTop: '40px' }}>Gráfica de Codo</h2>
      <Line data={elbowData} options={elbowOptions} />

      <h2 style={{ marginTop: '40px' }}>Tabla de Inercias</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>Número de Clústeres (k)</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Inercia (Distorsión)</th>
          </tr>
        </thead>
        <tbody>
          {kValues.map((k, index) => (
            <tr key={k} style={{ backgroundColor: index === elbowPointIndex ? 'lightyellow' : 'transparent' }}>
              <td style={{ border: '1px solid black', padding: '8px' }}>{k}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{distortions[index].toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InteractiveClusteringPlot;
