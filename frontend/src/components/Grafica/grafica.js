import './grafica.css';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Configuracion = () => {
  return (
    <div className="configuracion-container" >
      <h1 className="titulo">Configuración de Aprendizaje Supervisado</h1>
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
              <label className="param">Fórmula</label>
              <input type="text" placeholder="Y = mx + b" />
              </div>
              <div className="input-group">
              <label className="param">Parámetro de Regularización</label>
              <input type="text" placeholder="Placeholder" />
              </div>
              <div className="input-group">
              <label className="param">Ajuste de Intercepto</label>
              <div className="input-conf">
              <input type="checkbox" id="habilitado" />
              <label for="ajuste">Habilitado</label>
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
                        <input type="checkbox" id="habilitado" />
                        <label for="etiqueta">Habilitado</label>
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
                    <input type="checkbox" id="habilitado" />
                    <label for="etiqueta">Habilitado</label>
                </div>
                </div>
                <div className="input-conf">
                <input type="checkbox"/>
                <label>Variables</label>
                <button type="button">Agregar Variable</button>
                </div>
              <input type="text" placeholder="X=0" />
              <div className="input-conf">
              <input type="checkbox"/>
              <label>Puntos de la Recta</label>
              <button type="button">Agregar Puntos</button>
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
    </div>
  );
};

export default Configuracion;
