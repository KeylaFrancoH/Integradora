import './grafica.css';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Modal, Button, TextInput, NumberInput, Group } from '@mantine/core';
import React, { useState } from 'react';

const Grafica = () => {
  const { idCurso } = useParams();
  const location = useLocation();
  const cursoTitulo = location.state?.cursoTitulo || "Curso no especificado";

  const [variableModalOpen, setVariableModalOpen] = useState(false);
  const [pointModalOpen, setPointModalOpen] = useState(false);
  const [variable, setVariable] = useState('');
  const [pointX, setPointX] = useState(0);
  const [pointY, setPointY] = useState(0);

  const handleVariableSubmit = () => {
    // Maneja el envío de la variable
    console.log('Variable:', variable);
    setVariableModalOpen(false);
  };

  const handlePointSubmit = () => {
    // Maneja el envío del punto
    console.log('Punto:', { x: pointX, y: pointY });
    setPointModalOpen(false);
  };

  return (
    <div className="configuracion-container">
      <h1 className="titulo">Configuración de {cursoTitulo}</h1>
      <div className="configuracion-content">
        <form>
          <div className="section">
            <h2>Título</h2>
            <input type="text" placeholder="Título del ejercicio" />
          </div>
          <div className="section">
            <h2>Enunciado</h2>
            <input type="text" placeholder="Título del ejercicio" />
          </div>
          <div className="section">
            <h2>Selección Algoritmo</h2>
            <select>
              <option>Regresión Lineal</option>
              {/* Otras opciones */}
            </select>
          </div>
          <div className="section">
            <h2>Parámetros</h2>
            <div className="input-group">
              <div className="input-conf">
                <div className="input-group">
                  <label className="param" htmlFor="formula">Fórmula</label>
                  <input type="text" id="formula" placeholder="Y = mx + b" />
                </div>
                <div className="input-group">
                  <label className="param" htmlFor="regularizacion">Parámetro de Regularización</label>
                  <input type="text" id="regularizacion" placeholder="Placeholder" />
                </div>
                <div className="input-group">
                  <label className="param" htmlFor="ajuste">Ajuste de Intercepto</label>
                  <div className="input-conf">
                    <input type="checkbox" id="habilitado" />
                    <label htmlFor="habilitado">Habilitado</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="section">
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
                  <input type="checkbox" id="etiqueta" />
                  <label htmlFor="etiqueta">Habilitado</label>
                </div>
              </div>
            </div>
          </div>
          <div className="section">
            <h2>Cargar Datos</h2>
            <button type="button" className="subir-button">Subir</button>
          </div>
          <div className="section">
            <div className="input-group">
              <div className="input-conf">
                <h2>Configuracion Ejercicios</h2>
                <div className="input-conf">
                  <input type="checkbox" id="habilitado-ejercicios" />
                  <label htmlFor="habilitado-ejercicios">Habilitado</label>
                </div>
              </div>
              <div className="input-conf">
                <input type="checkbox" id="variables" />
                <label htmlFor="variables">Variables</label>
                <button type="button" onClick={() => setVariableModalOpen(true)}>Agregar Variable</button>
              </div>
              <input type="text" placeholder="X=0" />
              <div className="input-conf">
                <input type="checkbox" id="puntos-recta" />
                <label htmlFor="puntos-recta">Puntos de la Recta</label>
                <button type="button" onClick={() => setPointModalOpen(true)}>Agregar Puntos</button>
              </div>
              <div className="mensaje">No existen Puntos de la Recta</div>
            </div>
          </div>
          <div className="section">
            <h2>Intentos Múltiples</h2>
            <input type="number" placeholder="Número de intentos" />
          </div>
          <div className="section">
            <h2>Instrucciones</h2>
            <textarea placeholder="Instrucciones"></textarea>
          </div>
          <div className="navigation-buttons">
            <button type="button" className="save-button">Guardar</button>
          </div>
        </form>
      </div>

      {/* Modal para agregar variables */}
      <Modal
        opened={variableModalOpen}
        onClose={() => setVariableModalOpen(false)}
        title="Agregar Variable"
      >
        <TextInput
          value={variable}
          onChange={(event) => setVariable(event.currentTarget.value)}
          placeholder="Nombre de la variable"
        />
        <Group position="right" mt="md">
          <Button onClick={handleVariableSubmit}>Agregar</Button>
        </Group>
      </Modal>

      {/* Modal para agregar puntos */}
      <Modal
        opened={pointModalOpen}
        onClose={() => setPointModalOpen(false)}
        title="Agregar Puntos"
      >
        <NumberInput
          value={pointX}
          onChange={(value) => setPointX(value)}
          placeholder="X"
          label="Coordenada X"
        />
        <NumberInput
          value={pointY}
          onChange={(value) => setPointY(value)}
          placeholder="Y"
          label="Coordenada Y"
        />
        <Group position="right" mt="md">
          <Button onClick={handlePointSubmit}>Agregar</Button>
        </Group>
      </Modal>


    </div>

    

  );
};



export default Grafica;
