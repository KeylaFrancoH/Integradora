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
import InteractiveChart from "../graficaInteractiva/graficaInteractiva";
import ElbowPlot from "../graficaCodo/codo";
const StepCard = ({ title, content }) => (
  <div className="step-card">
    <h2>{title}</h2>
    <div>{content}</div>
  </div>
);

// Componente para mostrar puntos
const PointsList = ({ points }) => {
  console.log("POINTSSSS", points);
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
  const { courseTitle, temaId, temaTitle, idCurso } = location.state;
  const [material, setMaterial] = useState("");
  const [enlaces, setEnlaces] = useState([]);
  const [enlacesCompletos, setEnlacesCompletos] = useState([]);
  const [archivos, setArchivos] = useState([]);
  const [configuraciones, setConfiguraciones] = useState([]);
  const [puntos, setPuntos] = useState([]);
  const [parametros, setParametros] = useState([]);
  const [idConfiguracion, setIdConfiguracion] = useState(null);
  const [contenidoEjercicio, setContenidoEjercicio] = useState([]);
  const [instrucciones, setInstrucciones] = useState("");
  const [formula, setFormula] = useState("");
  const [enlacesVideos, setEnlacesVideos] = useState([]); // Definir estado para enlaces de video
  const [contenido, setContenido] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener material del tema
        const temaResponse = await axios.get(
          `http://localhost:3000/api/temas/${idCurso}/${temaId}`
        );
        setMaterial(temaResponse.data.Material);

        // Obtener enlaces completos
        const enlaceCompletoResponse = await axios.get(
          `http://localhost:3000/api/enlaces`
        );

        // Asegurarse de que los datos son un array
        const enlacesArray = Array.isArray(enlaceCompletoResponse.data)
          ? enlaceCompletoResponse.data
          : [];

        // Extraer solo los idTema
        const idTemasArray = enlacesArray.map((enlace) => enlace.idTema);

        const enlacesResponse = await axios.get(
          `http://localhost:3000/api/enlaces/${temaId}`
        );

        const enlacesData = Array.isArray(enlacesResponse.data)
          ? enlacesResponse.data
          : [];
        //Extraer Contenido

        // Separar enlaces de video y otros enlaces
        const enlacesVideos = enlacesData.filter((enlace) =>
          enlace.Enlace.includes("youtube.com")
        );
        const enlacesNormales = enlacesData.filter(
          (enlace) => !enlace.Enlace.includes("youtube.com")
        );

        setEnlaces(enlacesNormales);

        // Setear enlaces de video para mostrarlos en la sección 3
        setEnlacesVideos(enlacesVideos);

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
        setInstrucciones(configuracionesData[0].instrucciones);

        if (configuracionesData.length > 0) {
          const configId = configuracionesData[0].idConfiguracion;
          setIdConfiguracion(configId);
          if (idCurso == 1) {
            // Obtener puntos usando idConfiguracion
            const puntosResponse = await axios.get(
              `http://localhost:3000/api/puntos/configuracion/${temaId}`
            );

            setPuntos(puntosResponse.data);
          }

          // Obtener parámetros usando idConfiguracion
          const parametrosResponse = await axios.get(
            `http://localhost:3000/api/parametros?idConfiguracion=${configId}`
          );
          setParametros(parametrosResponse.data);
          setFormula(parametrosResponse.data[0].formula);
          if (idCurso == 2) {
            const contenidoEjercicioResponse = await axios.get(
              `http://localhost:3000/api/contenidoEjercicios?idConfiguracion=2`
            );
            setContenidoEjercicio(contenidoEjercicioResponse.data);
          }
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchData();
  }, [temaId]);

  const stepContents = [
    {
      title: <div className="vista1titulo">{temaTitle}</div>,
      content: "Teoría relacionada al tema",
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
      title: <div className="vista1titulo">Videos</div>,
      content: (
        <div>
          {enlacesVideos.length > 0 ? (
            enlacesVideos.map((enlace, index) => (
              <div key={index} className="video-container">
                <iframe
                  width="1600"
                  height="750"
                  src={enlace.Enlace.replace("watch?v=", "embed/")}
                  title={`Video ${index + 1}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ))
          ) : (
            <p>No hay enlaces de video disponibles.</p>
          )}
        </div>
      ),
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
          <PointsList points={puntos} />
          <ParametrosList parametros={parametros} />
          <ContenidoEjerciciosList ejercicios={contenidoEjercicio} />
        </>
      ),
    },
    {
      title: "",
      content:
        idCurso === 1 ? (
          <InteractiveChart
            initialPoints={puntos}
            instrucciones={instrucciones}
            formula={formula}
          />
        ) : (
          <ElbowPlot />
        ),
    },
  ];

  const goToPreviousStep = () => {
    let newStep = currentStep - 1;
    // Encuentra el paso anterior que esté habilitado
    while (
      newStep > 0 &&
      ((newStep === 2 && !showSection2Button) ||
        (newStep === 3 && !showSection3Button) ||
        (newStep === 4 && !showSection4Button))
    ) {
      newStep--;
    }
    if (newStep > 0) {
      setCurrentStep(newStep);
    }
  };

  const goToNextStep = () => {
    let newStep = currentStep + 1;
    // Encuentra el siguiente paso que esté habilitado
    while (
      newStep <= 5 &&
      ((newStep === 2 && !showSection2Button) ||
        (newStep === 3 && !showSection3Button) ||
        (newStep === 4 && !showSection4Button))
    ) {
      newStep++;
    }
    if (newStep <= 5) {
      setCurrentStep(newStep);
    }
  };

  const showSection2Button = enlaces.length > 0;
  const showSection3Button = enlacesVideos.length > 0;
  const showSection4Button = 0;
  return (
    <div className="sequence-navigator">
      <div className="header-container">
        <h1 className="clases">{`${courseTitle} > ${temaTitle} > ${idCurso} `}</h1>
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
          className={`step-button ${currentStep === 3 ? "active" : ""} ${
            !showSection3Button ? "hidden" : ""
          }`}
        >
          <FaVideo />
        </button>
        <button
          onClick={() => setCurrentStep(4)}
          //className={currentStep === 4 ? "active" : ""}
          className={`step-button ${currentStep === 4 ? "active" : ""} ${
            !showSection4Button ? "hidden" : ""
          }`}
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
