import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaBook,
  FaPencilAlt,
  FaPuzzlePiece,
  FaVideo,
} from "react-icons/fa";
import { useLocation } from "react-router-dom";
import InteractiveChart from "../graficaInteractiva/graficaInteractiva";
import InteractiveClusteringCSV from "../kmeans/InteractiveClusteringCSV";
import KMeansChart from "../kmeans/InteractiveClusteringPlot";
import ContenidoEjerciciosList from "./ComponentesContenido/ContenidoEjerciciosList";
import EnlacesConsulta from "./ComponentesContenido/EnlacesConsulta";
import ParametrosList from "./ComponentesContenido/ParametrosList";
import PointsList from "./ComponentesContenido/PointList";
import "./contenido.css";

const StepCard = ({ title, content }) => (
  <div className="step-card">
    <h2>{title}</h2>
    <div>{content}</div>
  </div>
);

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
  const [formulaD, setFormulaD] = useState([]);
  const [enlacesVideos, setEnlacesVideos] = useState([]);
  const [contenido, setContenido] = useState([]);
  const [archivosLinks, setArchivosLinks] = useState([]);
  const [descripciones, setDescripciones] = useState([]);
  const [metodo, setMetodo] = useState("");
  const [enunciado, setEnunciado] = useState("");
  const [tituloEjercicio, setTituloEjercicio] = useState("");
  const [numero_clusters, setNumeroClusters] = useState(0);
  const [numero_iteraciones, setNumeroIteraciones] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const temaResponse = await axios.get(
          `http://localhost:3000/api/temas/${idCurso}/${temaId}`
        );
        setMaterial(temaResponse.data.Material);

        const enlaceCompletoResponse = await axios.get(
          `http://localhost:3000/api/enlaces`
        );

        const enlacesArray = Array.isArray(enlaceCompletoResponse.data)
          ? enlaceCompletoResponse.data
          : [];

        const idTemasArray = enlacesArray.map((enlace) => enlace.idTema);
        console.log("IDTEMAS:", idTemasArray);

        if (idTemasArray.includes(temaId)) {
          const enlacesResponse = await axios.get(
            `http://localhost:3000/api/enlaces/${temaId}`
          );

          const enlacesData = Array.isArray(enlacesResponse.data)
            ? enlacesResponse.data
            : [];
          try {
            const contenido = await axios.get(
              `http://localhost:3000/api/temas/${temaId}`
            );
            const data = contenido.data;
            const subtitulo = data.Subtitulo;
            const material = data.Material;
            console.log("DATA:", data);
          } catch (error) {
            console.error("Error al recuperar los datos:", error);
          }

          const enlacesVideos = enlacesData.filter((enlace) =>
            enlace.Enlace.includes("youtube.com")
          );
          const enlacesNormales = enlacesData.filter(
            (enlace) => !enlace.Enlace.includes("youtube.com")
          );

          setEnlaces(enlacesNormales);

          setEnlacesVideos(enlacesVideos);
        }

        try {
          if (temaId) {
            const archivosResponse = await axios.get(
              `http://localhost:3000/api/archivos/tema/${temaId}`
            );

            const archivos = Array.isArray(archivosResponse.data)
              ? archivosResponse.data
              : [];

            const archivosLinksExtraidos = archivos.map(
              (archivo) => archivo.archivo
            );
            const descripcionesExtraidas = archivos.map(
              (archivo) => archivo.descripcion || ""
            );

            setArchivosLinks(archivosLinksExtraidos);
            setDescripciones(descripcionesExtraidas);
          } else {
            console.warn(
              "temaId no está definido. No se realizará la solicitud."
            );
            setArchivosLinks([]);
            setDescripciones([]);
          }
        } catch (error) {
          console.error("Error al obtener los archivos:", error);
          setArchivosLinks([]);
          setDescripciones([]);
        }

        const configuracionesResponse = await axios.get(
          `http://localhost:3000/api/configuraciones?temaId=${temaId}`
        );
        const configuracionesData = Array.isArray(configuracionesResponse.data)
          ? configuracionesResponse.data
          : [];
        setConfiguraciones(configuracionesData);
        setInstrucciones(configuracionesData[temaId - 1].instrucciones);
        setEnunciado(configuracionesData[temaId - 1].Enunciado);
        setTituloEjercicio(configuracionesData[temaId - 1].Titulo);

        if (configuracionesData.length > 0) {
          const configId = configuracionesData[0].idConfiguracion;
          setIdConfiguracion(configId);
          if (idCurso == 1) {
            const puntosResponse = await axios.get(
              `http://localhost:3000/api/puntos/configuracion/${temaId}`
            );

            setPuntos(puntosResponse.data);
          }

          const parametrosResponse = await axios.get(
            `http://localhost:3000/api/parametros?idConfiguracion=${configId}`
          );
          setParametros(parametrosResponse.data);
          setFormula(parametrosResponse.data[temaId - 1].formula);
          setNumeroClusters(
            parametrosResponse.data[temaId - 1].numero_clusters
          );
          setNumeroIteraciones(
            parametrosResponse.data[temaId - 1].numero_iteraciones
          );

          if (idCurso == 2) {
            const contenidoEjercicioResponse = await axios.get(
              `http://localhost:3000/api/contenidoEjercicios?idConfiguracion=${configId}`
            );
            setContenidoEjercicio(contenidoEjercicioResponse.data);
            const metodosResponse = await axios.get(
              `http://localhost:3000/api/parametros?idConfiguracion=${configId}`
            );
            setMetodo(metodosResponse.data[temaId - 1].metodo_inicialización);
            console.log("confID", configId);
          }
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }

      const formulasResponse = await axios.get(
        `http://localhost:3000/api/formulas`
      );
      setFormulaD(formulasResponse.data);
    };

    fetchData();
  }, [temaId]);

  const stepContents = [
    {
      title: <div className="vista1titulo">{temaTitle}</div>,
      content: (
        <div className="material-texto">
          {material.split("\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      ),
    },
    {
      title: <div className="vista1titulo">Enlaces de Consulta</div>,
      content: <EnlacesConsulta enlaces={enlaces} />,
    },
    {
      title: <div className="vista1titulo">Videos</div>,
      content: (
        <div className="video-container">
          {enlacesVideos.length > 0 ? (
            enlacesVideos.map((enlace, index) => (
              <div key={index} className="video-wrapper">
                <iframe
                  width="900"
                  height="900"
                  src={enlace.Enlace.replace("watch?v=", "embed/")}
                  title={`Video ${index + 1}`}
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
            tema={temaTitle}
            enunciado={enunciado}
            tituloEjercicio={tituloEjercicio}
          />
        ) : idCurso === 2 ? (
          metodo !== "0" ? (
            <KMeansChart
              instrucciones={instrucciones}
              metodo={metodo}
              tema={temaTitle}
              enunciado={enunciado}
              tituloEjercicio={tituloEjercicio}
            />
          ) : (
            <InteractiveClusteringCSV
              instrucciones={instrucciones}
              metodo={metodo}
              tema={temaTitle}
              enunciado={enunciado}
              tituloEjercicio={tituloEjercicio}
              num_Clusters={numero_clusters}
            />
          )
        ) : null,
    },
  ];

  const goToPreviousStep = () => {
    let newStep = currentStep - 1;
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
  const obtenerNombreArchivo = (url) => {
    const partes = url.split("/");
    return partes[partes.length - 1];
  };
  return (
    <div className="sequence-navigator">
      <div className="header-container">
        <h1 className="clases">{`${courseTitle} > ${temaTitle} `}</h1>
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
          className="scroll-container"
          title={stepContents[currentStep - 1].title}
          content={stepContents[currentStep - 1].content}
        />
        <div className="header-container">
          <h1 className="clases">Archivos</h1>
          <div className="underline"></div>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {archivosLinks.map((link, index) => {
              const nombreArchivo = obtenerNombreArchivo(link);
              return (
                <li
                  key={index}
                  style={{
                    marginBottom: "15px",
                    display: "flex",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "5px",
                      }}
                    >
                      <span style={{ fontWeight: "bold" }}>
                        {nombreArchivo}
                      </span>
                    </div>
                    {descripciones[index] && (
                      <p style={{ margin: 0, color: "#555" }}>
                        {descripciones[index]}
                      </p>
                    )}
                  </div>
                  <a
                    href={link}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    type="button"
                    style={{
                      marginLeft: "10px",
                      height: "100%",
                      alignSelf: "stretch",
                      padding: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      backgroundColor: "#007bff",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    Descargar
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Contenido;
