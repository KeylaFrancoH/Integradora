import "./grafica.css";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import MathJax from "react-mathjax";
import axios from "axios";
import Modal from "react-modal";
import MathEditor from "./MathEditor";

const Grafica = () => {
  const { idCurso } = useParams();
  const location = useLocation();
  const cursoTitulo = location.state?.cursoTitulo || "Curso no especificado";
  const dataRecibida = location.state?.data || {};

  const [variableModalOpen, setVariableModalOpen] = useState(false);
  const [pointModalOpen, setPointModalOpen] = useState(false);
  const [fileModalOpen, setFileModalOpen] = useState(false);

  const [variable, setVariable] = useState("");
  const [variables, setVariables] = useState([]);
  const [editingVariableIndex, setEditingVariableIndex] = useState(null);

  const [pointX, setPointX] = useState(0);
  const [pointY, setPointY] = useState(0);
  const [points, setPoints] = useState([]);

  const [pointsX, setX] = useState([]);
  const [pointsY, setY] = useState([]);
  const [editingPointIndex, setEditingPointIndex] = useState(null);

  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);

  const [youtubeLinks, setYoutubeLinks] = useState([]);
  const [newYoutubeLink, setNewYoutubeLink] = useState("");

  const [formulas, setFormulas] = useState([]);
  const [formula, setFormula] = useState("");
  const [selectedFormula, setSelectedFormula] = useState("");
  const [graficos, setGraficos] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [titulo, setTitulo] = useState("");
  const [enunciado, setEnunciado] = useState("");
  const [instrucciones, setInstrucciones] = useState("");
  const [numeroIntentos, setNumeroIntentos] = useState(1);

  const [parametro, setParametro] = useState("");
  const [numeroClusters, setNumeroClusters] = useState("");
  const [numeroIteraciones, setNumeroIteraciones] = useState("");

  const [k_min, setKmin] = useState(0);
  const [k_max, setKmax] = useState(0);
  const [k_exacto, setKexacto] = useState(0);
  const [iter_min, setIterMin] = useState(0);
  const [iter_max, setIterMax] = useState(0);
  const [iter_exacto, setIterexacto] = useState(0);


  const currentUrl = window.location.href;
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/formulas")
      .then((response) => {
        const filteredFormulas = response.data.filter(
          (formula) => formula.idCurso === parseInt(idCurso)
        );
        if (filteredFormulas.length > 0) {
          setFormula(filteredFormulas[0].formula);
        }
        setFormulas(filteredFormulas);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [idCurso]);

  const handleChange = (event) => {
    const updatedFormula = event.target.value.replace(/\\\\/g, "\\");
    setFormula(updatedFormula);
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/graficos")
      .then((response) => {
        const filteredGraficos = response.data.filter(
          (grafico) => grafico.idCurso === parseInt(idCurso)
        );

        setGraficos(filteredGraficos);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [idCurso]);

  const handleVariableSubmit = () => {
    if (editingVariableIndex !== null) {
      setVariables(
        variables.map((v, i) => (i === editingVariableIndex ? variable : v))
      );
      setEditingVariableIndex(null);
    } else {
      setVariables([...variables, variable]);
    }
    setVariable("");
    setVariableModalOpen(false);
  };
  
  const handleEditVariable = (index) => {
    setVariable(variables[index]);
    setEditingVariableIndex(index);
    setVariableModalOpen(true);
  };

  const handleRemoveVariable = (index) => {
    setVariables(variables.filter((_, i) => i !== index));
  };

  const handleEditPoint = (index) => {
    const point = points[index];
    setPointX(point.x);
    setPointY(point.y);
    setEditingPointIndex(index);
    setPointModalOpen(true);
  };

  const handleRemovePoint = (index) => {
    setPoints(points.filter((_, i) => i !== index));
  };

  const handlePointSubmit = () => {
    const newPoint = { x: pointX, y: pointY };
    setX([...pointsX, pointX]);
    setY([...pointsY, pointY]);
    if (editingPointIndex !== null) {
      setPoints(points.map((p, i) => (i === editingPointIndex ? newPoint : p)));
      setEditingPointIndex(null);
    } else {
      setPoints([...points, newPoint]);
    }
    setPointX(0);
    setPointY(0);
    setPointModalOpen(false);
  };

  const handleFileSubmit = () => {
    if (file && description) {
      setFiles([...files, { file, description }]);
      setFile(null);
      setDescription("");
      setFileModalOpen(false);
    }
  };

  const handleAddYoutubeLink = () => {
    if (newYoutubeLink.trim() !== "") {
      setYoutubeLinks([...youtubeLinks, newYoutubeLink.trim()]);
      setNewYoutubeLink("");
    }
  };

  const handleSelectChange = (event) => {
    const formulaId = event.target.value;
    const formula = formulas.find((f) => f.idFormula === parseInt(formulaId));
    if (formula) {
      setSelectedFormula(formula.formula);
    }
  };
  const handleInputChange = (event) => {
    const updatedFormula = event.target.value.replace(/\\\\/g, "\\");
    setSelectedFormula(updatedFormula);
  };

  const handleSave = async () => {
    try {
      // Enviar datos de `data` a /api/temas
      const temaResponse = await axios.post("http://localhost:3000/api/temas", {
        idCurso,
        Titulo: dataRecibida.titulo,
        Subtitulo: dataRecibida.subtitulo,
        Material: dataRecibida.material,
      });

      // Guardar archivos subidos

      for (const archivo of dataRecibida.uploadedFiles) {
        await axios.post("http://localhost:3000/api/archivos", {
          idTema: temaResponse.data.idTema,
          archivo: "http://localhost:3000/Archivos/" + archivo.name,
          descripcion: archivo.description || "",
        });
      }

      dataRecibida.youtubeLinks.forEach((enlace, index) => {
        console.log(`Elemento ${index}:`, enlace);
        console.log("Data enviada:", {
          idTema: temaResponse.data.idTema,
          Enlace: enlace,
        });
      });

      for (const enlace of dataRecibida.youtubeLinks) {
        console.log("Enlace:", enlace);
        await axios.post("http://localhost:3000/api/enlaces", {
          idTema: temaResponse.data.idTema,
          Enlace: enlace,
        });
      }

      const configuracionResponse = await axios.post(
        "http://localhost:3000/api/configuraciones",
        {
          idTema: temaResponse.data.idTema,
          Titulo: titulo,
          Enunciado: enunciado,
          idFormula: formulas.find((f) => f.formula === selectedFormula)
            ?.idFormula,
          idGrafico: graficos[0].idGrafico,
          habilitado: true,
          intentos: numeroIntentos,
          instrucciones: instrucciones,
        }
      );

      console.log(configuracionResponse.data.idConfiguracion);
      const parametroResponse = await axios.post(
        "http://localhost:3000/api/parametros",
        {
          idConfiguracion: configuracionResponse.data.idConfiguracion,
          formula: selectedFormula || null,
          parametro_regularización: parametro || null,
          intercepto: true,

          metodo_inicialización: "aleatorio",

          numero_clusters: numeroClusters || null,
          numero_iteraciones: numeroIteraciones || null,
        }
      );

      if (idCurso === "1") {
        for (const x of variables) {
          await axios.post("http://localhost:3000/api/variables", {
            idConfiguracion: configuracionResponse.data.idConfiguracion,
            variable: x || null,
          });
        }

        for (let i = 0; i < pointsX.length; i++) {
          const valX = pointsX[i];
          const valY = pointsY[i];
    
          await axios.post("http://localhost:3000/api/puntos", {
            idConfiguracion: configuracionResponse.data.idConfiguracion,
            punto_x: valX,
            punto_y: valY,
          });
        }

        //ARREGLAR PUNTOS NO ESTOY PUDIENDO GUARDAR, Y DE AHÍ YA ESTARIAN TODOS LOS DATOS GUARDADOS
    
      }

      alert("Datos guardados correctamente");
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      alert("Hubo un error al guardar los datos.");
    }
  };

  // POR AHORA SOLO GUARDA TEMA, FALTA GUARDAR EJERCICIOS, FALTA GUARDAT TODO, SE NECESITA HACER QUE SE GUARDEN ARCHIVOS
  const renderCommonFields = () => (
    <>
      <div className="section-select">
        <div className="section">
          <h2>Título</h2>
          <input
            type="text"
            placeholder="Título del ejercicio"
            value={titulo}
            onChange={(e) => {
              setTitulo(e.target.value);
            }}
          />
        </div>
        <div className="section">
          <h2>Enunciado</h2>
          <input
            type="text"
            placeholder="Enunciado del ejercicio"
            value={enunciado}
            onChange={(e) => {
              setEnunciado(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="section-select">
        <div className="section">
          <h2>Selección Algoritmo</h2>
          <select
            id="formula-select"
            onChange={handleSelectChange}
            value={
              formulas.find((f) => f.formula === selectedFormula)?.idFormula ||
              ""
            }
          >
            <option value="">Selecciona una fórmula</option>
            {formulas.map((formula) => (
              <option key={formula.idFormula} value={formula.idFormula}>
                {formula.nombreFormula}
              </option>
            ))}
          </select>
        </div>
        <div className="section">
          <h2>Intentos Múltiples</h2>
          <input
            type="number"
            value={numeroIntentos}
            placeholder="Número de intentos"
            min={1}
            step={1}
            onChange={(e) => {
              setNumeroIntentos(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="section">
        <h2>Instrucciones</h2>
        <textarea
          type="text"
          placeholder="Instrucciones"
          value={instrucciones}
          onChange={(e) => {
            setInstrucciones(e.target.value);
          }}
        />
      </div>
    </>
  );

  const renderForm = () => {
    if (idCurso === "1") {
      return (
        <form>
          {renderCommonFields()}
          <div className="section">
            <h2>Parámetros </h2>
            <div className="section-select-param">
              <div className="input-group">
                <div className="input-conf">
                  <div className="input-group">
                    <label className="param" htmlFor="formula">
                      Fórmula
                    </label>
                    <input
                      type="text"
                      id="formula"
                      value={selectedFormula}
                      onChange={handleInputChange}
                      placeholder="Y = mx + b"
                    />
                    <div className="formula-display">
                      <MathJax.Provider>
                        <MathJax.Node formula={`\\(${selectedFormula}\\)`} />
                      </MathJax.Provider>
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="param" htmlFor="regularizacion">
                      Parámetro de Regularización alpha
                    </label>
                    <input
                      type="text"
                      id="regularizacion"
                      placeholder="α"
                      value={parametro}
                      onChange={(e) => {
                        setParametro(e.target.value);
                      }}
                    />
                  </div>
                  <div className="input-group">
                    <label className="param" htmlFor="ajuste">
                      Ajuste de Intercepto
                    </label>
                    <div className="input-confs">
                      <input
                        type="radio"
                        id="ajuste-habilitado"
                        name="ajuste"
                        value="habilitado"
                      />
                      <label htmlFor="ajuste-habilitado">Habilitado</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="section-select-param">
            <div className="input-conf">
              <div className="input-group">
                <h2>Gráfica</h2>
                <select>
                  <option value="">Selecciona un gráfico</option>
                  {graficos.map((grafico) => (
                    <option key={grafico.idGrafico} value={grafico.idGrafico}>
                      {grafico.Tipo_grafico}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <h2>Etiquetas</h2>
                <div className="input-conf">
                  <input
                    type="radio"
                    id="etiqueta-habilitado"
                    name="etiqueta"
                    value="habilitado"
                  />
                  <label htmlFor="etiqueta-habilitado">Habilitado</label>
                </div>
              </div>
            </div>
          </div>

          <div className="section">
            <h2>Configuración de ejercicios</h2>
            <div className="input-group flex-container">
              <div className="input-conf">
                <label htmlFor="variables">Variables</label>
                <button
                  type="button"
                  onClick={() => setVariableModalOpen(true)}
                >
                  Agregar Variable
                </button>
              </div>
              <ul className="variables-list">
                {variables.map((variable, index) => (
                  <li key={index}>
                    <span>{variable}</span>
                    <button
                      type="button"
                      onClick={() => handleEditVariable(index)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveVariable(index)}
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>

              <div className="input-conf">
                <label htmlFor="puntos-recta">Puntos de la Recta</label>
                <button type="button" onClick={() => setPointModalOpen(true)}>
                  Agregar Puntos
                </button>
              </div>
              <ul className="variables-list">
                {points.map((point, index) => (
                  <li key={index}>
                    <span>
                      X: {point.x}, Y: {point.y}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleEditPoint(index)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemovePoint(index)}
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="section attachment-sections">
            <div className="attachment-section">
              <h2>Archivos Subidos</h2>
              <button
                type="button"
                className="subir-button"
                onClick={() => setFileModalOpen(true)}
              >
                Subir
              </button>
              <ul className="uploaded-files">
                {files.map((fileObj, index) => (
                  <li key={index}>
                    <span>{fileObj.file.name}</span>
                    <input
                      type="text"
                      value={fileObj.description}
                      onChange={(e) =>
                        setFiles(
                          files.map((f, i) =>
                            i === index
                              ? { ...f, description: e.target.value }
                              : f
                          )
                        )
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFiles(files.filter((_, i) => i !== index))
                      }
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="input-conf">
            <button type="button" className="save-button" onClick={handleSave}>
              Guardar
            </button>
          </div>
        </form>
      );
    } else if (idCurso === "2") {
      return (
        <form>
          {renderCommonFields()}
          <div className="section">
            <h2>Parámetros</h2>
            <div className="section-select-param-2">
              <div className="input-group">
                <div className="input-conf">
                  <label className="param" htmlFor="metodo">
                    Método de Inicialización de Centroides
                  </label>
                  <select id="metodo">
                    <option>Aleatorio</option>
                    {/* Otras opciones */}
                  </select>
                </div>
                <div className="input-conf">
                  <label className="param" htmlFor="clusters">
                    Número de Clusters (K)
                  </label>
                  <input
                    type="number"
                    value={numeroClusters}
                    id="clusters"
                    placeholder="Número de clústers"
                    min={0}
                    step={1}
                    onChange={(e) => {
                      setNumeroClusters(e.target.value);
                    }}
                  />
                </div>
                <div className="input-conf">
                  <label className="param" htmlFor="iteraciones">
                    Número Máximo de Iteraciones
                  </label>
                  <input
                    type="number"
                    value={numeroIteraciones}
                    id="iteraciones"
                    placeholder="Número de iteraciones"
                    min={0}
                    step={1}
                    onChange={(e) => {
                      setNumeroIteraciones(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="section">
            <div className="section-select-param">
              <div className="input-conf">
                <div className="input-group">
                  <h2>Gráfica</h2>
                  <select>
                    <option value="">Selecciona un gráfico</option>
                    {graficos.map((grafico) => (
                      <option key={grafico.idGrafico} value={grafico.idGrafico}>
                        {grafico.Tipo_grafico}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <h2>Etiquetas</h2>
                  <div className="input-conf">
                    <input
                      type="radio"
                      id="etiqueta-habilitado"
                      name="etiqueta"
                      value="habilitado"
                    />
                    <label htmlFor="etiqueta-habilitado">Habilitado</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="section">
            <h2>Configuración de ejercicios</h2>
            <div className="configuration-container">
              <div className="clusters-column">
                <div className="clusters-settings">
                  <label htmlFor="num-clusters">Número de Clusters (K)</label>
                  <div className="clusters-input-fields">
                    Mínimo
                    <input
                      type="number"
                      value={k_min}
                      id="clusters"
                      placeholder="Mínimo"
                      min={0}
                      step={1}
                      onChange={(e) => {
                        setKmin(e.target.value);
                      }}
                    />
                    Máximo
                    <input
                      type="number"
                      value={k_max}
                      id="clusters"
                      placeholder="Máximo"
                      min={0}
                      step={1}
                      onChange={(e) => {
                        setKmax(e.target.value);
                      }}
                    />
                    Valor Exacto
                    <input
                      type="number"
                      value={k_exacto}
                      id="clusters"
                      placeholder="Valor Exacto"
                      min={0}
                      step={1}
                      onChange={(e) => {
                        setKexacto(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="iterations-column">
                <div className="iterations-settings">
                  <label htmlFor="num-iteraciones">
                    Número Máximo de Iteraciones
                  </label>
                  <div className="iterations-input-fields">
                    Mínimo
                    <input
                      type="number"
                      value={iter_min}
                      id="clusters"
                      placeholder="Mínimo"
                      min={0}
                      step={1}
                      onChange={(e) => {
                        setIterMin(e.target.value);
                      }}
                    />
                    Máximo
                    <input
                      type="number"
                      value={iter_max}
                      id="clusters"
                      placeholder="Máximo"
                      min={0}
                      step={1}
                      onChange={(e) => {
                        setIterMax(e.target.value);
                      }}
                    />
                    Valor Exacto
                    <input
                      type="number"
                      value={iter_exacto}
                      id="clusters"
                      placeholder="Valor Exacto"
                      min={0}
                      step={1}
                      onChange={(e) => {
                        setIterexacto(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="section attachment-sections">
            <div className="attachment-section">
              <h2>Archivos Subidos</h2>
              <button
                type="button"
                className="subir-button"
                onClick={() => setFileModalOpen(true)}
              >
                Subir
              </button>
              <ul className="uploaded-files">
                {files.map((fileObj, index) => (
                  <li key={index}>
                    <span>{fileObj.file.name}</span>
                    <input
                      type="text"
                      value={fileObj.description}
                      onChange={(e) =>
                        setFiles(
                          files.map((f, i) =>
                            i === index
                              ? { ...f, description: e.target.value }
                              : f
                          )
                        )
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFiles(files.filter((_, i) => i !== index))
                      }
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="input-confz">
            <button type="button" className="save-button" onClick={handleSave}>
              Guardar
            </button>
          </div>
        </form>
      );
    }
  };

  return (
    <div className="main-container">
      <header>
        <h1>Gráficas - {cursoTitulo}</h1>
      </header>
      {renderForm()}
      <Modal
        isOpen={variableModalOpen}
        onRequestClose={() => setVariableModalOpen(false)}
        contentLabel="Agregar Variable"
      >
        <h2>Agregar Variable</h2>
        <input
          type="text"
          value={variable}
          onChange={(e) => setVariable(e.target.value)}
          placeholder="Variable"
        />
        <div className="botones-modal">
          <button onClick={handleVariableSubmit}>Agregar</button>
          <button onClick={() => setVariableModalOpen(false)}>Cancelar</button>
        </div>
      </Modal>
      <Modal
        isOpen={pointModalOpen}
        onRequestClose={() => setPointModalOpen(false)}
        contentLabel="Agregar Punto"
      >
        <h2>Agregar Punto</h2>
        <div className="input-row">
          <label>
            X:
            <input
              type="number"
              value={pointX}
              onChange={(e) => setPointX(Number(e.target.value))}
              placeholder="X"
            />
          </label>
          <label>
            Y:
            <input
              type="number"
              value={pointY}
              onChange={(e) => setPointY(Number(e.target.value))}
              placeholder="Y"
            />
          </label>
        </div>
        <div className="botones-modal">
          <button onClick={handlePointSubmit}>Agregar</button>
          <button onClick={() => setPointModalOpen(false)}>Cancelar</button>
        </div>
      </Modal>

      <Modal
        isOpen={fileModalOpen}
        onRequestClose={() => setFileModalOpen(false)}
        contentLabel="Subir Archivo"
      >
        <h2>Subir Archivo</h2>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción"
        />
        <div className="botones-modal">
          <button onClick={handleFileSubmit}>Subir</button>
          <button onClick={() => setFileModalOpen(false)}>Cancelar</button>
        </div>
      </Modal>
    </div>
  );
};

Modal.setAppElement("#root");

export default Grafica;
