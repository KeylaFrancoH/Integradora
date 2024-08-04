import React, { useState, useEffect } from "react";
import "./contenido.css"; // Importa el archivo de estilos
import {
  FaBook,
  FaPencilAlt,
  FaVideo,
  FaPuzzlePiece,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { useLocation } from "react-router-dom";
import axios from "axios";
import InteractiveChart from "./graficaInteractiva"; 
const StepCard = ({ title, content }) => (
  <div className="step-card">
    <h2>{title}</h2>
    <div>{content}</div>
  </div>
);

// Componente para mostrar puntos
const PointsList = ({ points }) => {
  const pointsElements = [];

  if (points.length > 0) {
    points.forEach((point) => {
      const { idPuntos, punto_X, punto_Y } = point;

      pointsElements.push(
        <div key={idPuntos} className="point-item">
          <p>
            <strong>Ubicación X:</strong> {punto_X}
          </p>
          <p>
            <strong>Ubicación Y:</strong> {punto_Y}
          </p>
        </div>
      );
    });
  }

  return (
    <div className="points-container">
      <h3>Puntos:</h3>
      {pointsElements.length > 0 ? (
        pointsElements
      ) : (
        <p>No hay puntos disponibles.</p>
      )}
    </div>
  );
};

// Componente para mostrar parámetros
const ParametrosList = ({ parametros }) => {
  const parametrosElements = [];

  if (parametros.length > 0) {
    parametros.forEach((parametro) => {
      const {
        idParametro,
        formula,
        parametro_regularización,
        intercepto,
        metodo_inicialización,
        numero_clusters,
        numero_iteraciones,
      } = parametro;

      parametrosElements.push(
        <div key={idParametro} className="parametro-item">
          <p>
            <strong>Fórmula:</strong> {formula}
          </p>
          <p>
            <strong>Regularización:</strong> {parametro_regularización}
          </p>
          <p>
            <strong>Intercepto:</strong> {intercepto ? "Sí" : "No"}
          </p>
          <p>
            <strong>Método de Inicialización:</strong> {metodo_inicialización}
          </p>
          <p>
            <strong>Número de Clusters:</strong> {numero_clusters}
          </p>
          <p>
            <strong>Número de Iteraciones:</strong> {numero_iteraciones}
          </p>
        </div>
      );
    });
  }

  return (
    <div className="parametros-container">
      <h3>Parámetros:</h3>
      {parametrosElements.length > 0 ? (
        parametrosElements
      ) : (
        <p>No hay parámetros disponibles.</p>
      )}
    </div>
  );
};

const ContenidoEjerciciosList = ({ ejercicios }) => (
  <div className="ejercicios-container">
    <h3>Contenido de Ejercicios:</h3>
    {ejercicios.length > 0 ? (
      ejercicios.map((ejercicio) => (
        <div key={ejercicio.idContenidoEjercicios} className="ejercicio-item">
          <p>
            <strong>K Mínimo:</strong> {ejercicio.k_min}
          </p>
          <p>
            <strong>K Máximo:</strong> {ejercicio.k_max}
          </p>
          <p>
            <strong>K Exacto:</strong> {ejercicio.k_exacto}
          </p>
          <p>
            <strong>Iteración Mínima:</strong> {ejercicio.iteracion_min}
          </p>
          <p>
            <strong>Iteración Máxima:</strong> {ejercicio.iteracion_max}
          </p>
          <p>
            <strong>Iteración Exacta:</strong> {ejercicio.iteracion_exacto}
          </p>
        </div>
      ))
    ) : (
      <p>No hay contenido de ejercicios disponible.</p>
    )}
  </div>
);
// Componente del Navegador de Secuencia
const Contenido = () => {
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const { courseTitle, temaId, temaTitle } = location.state;
  const [material, setMaterial] = useState("");
  const [enlaces, setEnlaces] = useState([]);
  const [archivos, setArchivos] = useState([]);
  const [configuraciones, setConfiguraciones] = useState([]);
  const [puntos, setPuntos] = useState([]); // Inicializar como array vacío
  const [parametros, setParametros] = useState([]); // Inicializar como array vacío
  const [idConfiguracion, setIdConfiguracion] = useState(null);
  const [contenidoEjercicio, setContenidoEjercicio] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener material del tema
        const temaResponse = await axios.get(
          `http://localhost:3000/api/temas/${temaId}`
        );
        setMaterial(temaResponse.data.Material);

        // Obtener enlaces
        const enlacesResponse = await axios.get(
          `http://localhost:3000/api/enlaces/${temaId}`
        );
        setEnlaces(
          Array.isArray(enlacesResponse.data) ? enlacesResponse.data : []
        );

        console.log(temaResponse.data.idTema);

        // Obtener archivos
        const archivosResponse = await axios.get(
          `http://localhost:3000/api/archivos?temaId=${temaId}`
        );
        setArchivos(
          Array.isArray(archivosResponse.data) ? archivosResponse.data : []
        );

        // Obtener configuraciones y establecer idConfiguracion
        const configuracionesResponse = await axios.get(
          `http://localhost:3000/api/configuraciones?temaId=${temaId}`
        );
        const configuracionesData = Array.isArray(configuracionesResponse.data)
          ? configuracionesResponse.data
          : [];
        setConfiguraciones(configuracionesData);
        if (configuracionesData.length > 0) {
          const configId = configuracionesData[0].idConfiguracion;
          setIdConfiguracion(configId);

          // Obtener puntos usando idConfiguracion
          const puntosResponse = await axios.get(
            `http://localhost:3000/api/puntos/${configId}`
          );
          setPuntos(puntosResponse.data);

          // Obtener parámetros usando idConfiguracion
          const parametrosResponse = await axios.get(
            `http://localhost:3000/api/parametros?idConfiguracion=${configId}`
          );
          setParametros(parametrosResponse.data);

          const contenidoEjercicioResponse = await axios.get(
            `http://localhost:3000/api/contenidoEjercicios?idConfiguracion=2`
          );
          setContenidoEjercicio(contenidoEjercicioResponse.data);
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchData();
  }, [temaId]);

  const stepContents = [
    {
      title: "Paso 1",
      content:
        "Contenido variado del Paso 1. Puedes incluir imágenes, texto, o cualquier otro componente.",
    },
    {
      title: "Paso 2",
      content: (
        <ul>
          {enlaces.length > 0 ? (
            enlaces.map((enlace, index) => (
              <li key={index}>
                <a
                  href={enlace.Enlace}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {enlace.Enlace}
                </a>
              </li>
            ))
          ) : (
            <li>No hay enlaces disponibles.</li>
          )}
        </ul>
      ),
    },
    {
      title: "Paso 3",
      content:
        "Contenido variado del Paso 3. Aquí puedes mostrar formularios, tablas, o cualquier otra cosa.",
    },
    {
      title: "Paso 4",
      content: (
        <>
          <div className="archivos-container">
            <h3>Archivos:</h3>
            {archivos.length > 0 ? (
              archivos.map((archivo) => (
                <div key={archivo.idArchivo} className="archivo-item">
                  <a href={archivo.archivo} download>
                    {archivo.archivo}
                  </a>
                  <p>{archivo.descripcion}</p>
                </div>
              ))
            ) : (
              <p>No hay archivos disponibles.</p>
            )}
          </div>
          <div className="configuraciones-container">
            <h3>Configuraciones:</h3>
            {configuraciones.length > 0 ? (
              configuraciones.map((configuracion) => (
                <div
                  key={configuracion.idConfiguracion}
                  className="configuracion-item"
                >
                  <h4>{configuracion.Titulo}</h4>
                  <p>{configuracion.Enunciado}</p>
                  <p>Habilitado: {configuracion.habilitado ? "Sí" : "No"}</p>
                  <p>{configuracion.instrucciones}</p>
                  <p>{configuracion.intentos}</p>
                </div>
              ))
            ) : (
              <p>No hay configuraciones disponibles.</p>
            )}
          </div>
          <PointsList points={puntos} /> {/* Mostrar puntos */}
          <ParametrosList parametros={parametros} /> {/* Mostrar parámetros */}
          <ContenidoEjerciciosList ejercicios={contenidoEjercicio} />
        </>
      ),
    },
    {
      title: "Paso 5",
      content: <InteractiveChart initialPoints={puntos} />,
    },
  ];

  const goToNextStep = () => {
    if (currentStep < stepContents.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const showSection2Button = enlaces.length > 0;

  return (
    <div className="sequence-navigator">
      <div className="header-container">
        <h1 className="clases">{`${courseTitle} > ${temaTitle}`}</h1>
        <div className="underline"></div>
      </div>
      <div className="navigation-buttons">
        <button onClick={goToPreviousStep} className="arrow-button">
          <FaArrowLeft />
        </button>
        <button
          onClick={() => setCurrentStep(1)}
          className={currentStep === 1 ? "active" : ""}
        >
          <FaBook />
        </button>
        <button
          onClick={() => setCurrentStep(2)}
          className={`step-button ${currentStep === 2 ? "active" : ""} ${
            !showSection2Button ? "hidden" : ""
          }`}
        >
          <FaPencilAlt />
        </button>
        <button
          onClick={() => setCurrentStep(3)}
          className={currentStep === 3 ? "active" : ""}
        >
          <FaVideo />
        </button>
        <button
          onClick={() => setCurrentStep(4)}
          className={currentStep === 4 ? "active" : ""}
        >
          <FaPuzzlePiece />
        </button>
        <button
          onClick={() => setCurrentStep(5)}
          className={currentStep === 5 ? "active" : ""}
        >
          <FaPuzzlePiece />
        </button>
        <button onClick={goToNextStep} className="arrow-button">
          <FaArrowRight />
        </button>
      </div>
      <div className="step-container">
        <StepCard
          title={stepContents[currentStep - 1].title}
          content={stepContents[currentStep - 1].content}
        />
        <p></p>
      </div>
    </div>
  );
};

export default Contenido;
