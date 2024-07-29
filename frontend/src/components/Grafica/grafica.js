import "./grafica.css";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import React, { useState } from "react";
import Modal from "react-modal";

const Grafica = () => {
  const { idCurso } = useParams();
  const location = useLocation();
  const cursoTitulo = location.state?.cursoTitulo || "Curso no especificado";
  const dataRecibida =  location.state?.data || {};


  const [variableModalOpen, setVariableModalOpen] = useState(false);
  const [pointModalOpen, setPointModalOpen] = useState(false);
  const [fileModalOpen, setFileModalOpen] = useState(false);

  const [variable, setVariable] = useState("");
  const [variables, setVariables] = useState([]);
  const [editingVariableIndex, setEditingVariableIndex] = useState(null);

  const [pointX, setPointX] = useState(0);
  const [pointY, setPointY] = useState(0);
  const [points, setPoints] = useState([]);
  const [editingPointIndex, setEditingPointIndex] = useState(null);

  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);

  const [youtubeLinks, setYoutubeLinks] = useState([]);
  const [newYoutubeLink, setNewYoutubeLink] = useState("");

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

  const handleRemoveYoutubeLink = (index) => {
    setYoutubeLinks(youtubeLinks.filter((_, i) => i !== index));
  };

  const handleEditYoutubeLink = (index, newLink) => {
    const updatedLinks = [...youtubeLinks];
    updatedLinks[index] = newLink;
    setYoutubeLinks(updatedLinks);
  };

  const renderCommonFields = () => (
    <>
      <div className="section-select">
        <div className="section">
          <h2>Título</h2>
          <input type="text" placeholder="Título del ejercicio" />
        </div>
        <div className="section">
          <h2>Enunciado</h2>
          <input type="text" placeholder="Enunciado del ejercicio" />
        </div>
      </div>
      <div className="section-select">
        <div className="section">
          <h2>Selección Algoritmo</h2>
          <select>
            <option>Regresión Lineal</option>
            {/* Otras opciones */}
          </select>
        </div>
        <div className="section">
          <h2>Intentos Múltiples</h2>
          <input type="number" placeholder="Número de intentos" />
        </div>
      </div>
      <div className="section">
        <h2>Instrucciones</h2>
        <textarea placeholder="Instrucciones"></textarea>
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
                    <input type="text" id="formula" placeholder="Y = mx + b" />
                  </div>
                  <div className="input-group">
                    <label className="param" htmlFor="regularizacion">
                      Parámetro de Regularización alpha
                    </label>
                    <input type="text" id="regularizacion" placeholder="α" />
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
                  <option>Gráfico de Líneas</option>
                  {/* Otras opciones */}
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

          <div className="section">
            <h2>Configuración de ejercicios</h2>
            <div className="input-group flex-container">
              <div className="input-conf">
                <input
                  type="radio"
                  id="variables"
                  name="variables"
                  value="habilitado"
                />
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
                <input
                  type="radio"
                  id="puntos-recta"
                  name="puntos-recta"
                  value="habilitado"
                />
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

          <div className="navigation-buttons">
            <button type="button" className="save-button">
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
                  <input type="text" id="clusters" placeholder="Placeholder" />
                </div>
                <div className="input-conf">
                  <label className="param" htmlFor="iteraciones">
                    Número Máximo de Iteraciones
                  </label>
                  <input
                    type="text"
                    id="iteraciones"
                    placeholder="Placeholder"
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
                    <option>Dendograma</option>
                    {/* Otras opciones */}
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
                  <input type="number" placeholder="Mínimo" />
                  <input type="number" placeholder="Máximo" />
                  <input type="number" placeholder="Valor Exacto" />
                </div>
              </div>
            </div>

            <div className="iterations-column">
              <div className="iterations-settings">
                <label htmlFor="num-iteraciones">
                  Número Máximo de Iteraciones
                </label>
                <div className="iterations-input-fields">
                  <input type="number" placeholder="Mínimo" />
                  <input type="number" placeholder="Máximo" />
                  <input type="number" placeholder="Valor Exacto" />
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

          <div className="navigation-buttons">
            <button type="button" className="save-button">
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
        <input
          type="number"
          value={pointX}
          onChange={(e) => setPointX(Number(e.target.value))}
          placeholder="X"
        />
        <input
          type="number"
          value={pointY}
          onChange={(e) => setPointY(Number(e.target.value))}
          placeholder="Y"
        />
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
