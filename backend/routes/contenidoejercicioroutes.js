// routes/contenidoejercicioroutes.js
const express = require('express');
const router = express.Router();
const { Sequelize } = require('sequelize');
const config = require('../config/config.json');
const sequelize = new Sequelize(config.integradora.database, config.integradora.username, config.integradora.password, {
  host: config.integradora.host,
  dialect: 'mysql'
});
const ContenidoEjercicio = require('../models/contenidoejercicio')(sequelize, Sequelize);

// POST para agregar un nuevo contenido de ejercicio
router.post('/', async (req, res) => {
  const { idConfiguracion, idEjercicio, nombre_variable, nuevo_valor } = req.body;
  try {
    const newContenidoEjercicio = await ContenidoEjercicio.create({ idConfiguracion, idEjercicio, nombre_variable, nuevo_valor });
    res.status(201).json(newContenidoEjercicio);
  } catch (error) {
    console.error('Error al crear contenido de ejercicio:', error);
    res.status(500).json({ error: 'Error al crear contenido de ejercicio' });
  }
});

// GET para obtener todos los contenidos de ejercicio
router.get('/', async (req, res) => {
  try {
    const contenidosEjercicio = await ContenidoEjercicio.findAll();
    res.json(contenidosEjercicio);
  } catch (error) {
    console.error('Error al obtener contenidos de ejercicio:', error);
    res.status(500).json({ error: 'Error al obtener contenidos de ejercicio' });
  }
});

// GET para obtener un contenido de ejercicio por ID de contenido
router.get('/:id', async (req, res) => {
  try {
    const contenidoEjercicio = await ContenidoEjercicio.findByPk(req.params.id);
    if (contenidoEjercicio) {
      res.json(contenidoEjercicio);
    } else {
      res.status(404).json({ error: 'Contenido de ejercicio no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener contenido de ejercicio:', error);
    res.status(500).json({ error: 'Error al obtener contenido de ejercicio' });
  }
});

// PUT para actualizar un contenido de ejercicio por ID de contenido
router.put('/:id', async (req, res) => {
  const { idConfiguracion, idEjercicio, nombre_variable, nuevo_valor } = req.body;
  try {
    const [updated] = await ContenidoEjercicio.update({ idConfiguracion, idEjercicio, nombre_variable, nuevo_valor }, {
      where: { idContenido: req.params.id }
    });
    if (updated) {
      const updatedContenidoEjercicio = await ContenidoEjercicio.findByPk(req.params.id);
      res.status(200).json(updatedContenidoEjercicio);
    } else {
      res.status(404).json({ error: 'Contenido de ejercicio no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar contenido de ejercicio:', error);
    res.status(500).json({ error: 'Error al actualizar contenido de ejercicio' });
  }
});

// DELETE para eliminar un contenido de ejercicio por ID de contenido
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await ContenidoEjercicio.destroy({
      where: { idContenido: req.params.id }
    });
    if (deleted) {
      res.status(204).json({ message: 'Contenido de ejercicio eliminado' });
    } else {
      res.status(404).json({ error: 'Contenido de ejercicio no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar contenido de ejercicio:', error);
    res.status(500).json({ error: 'Error al eliminar contenido de ejercicio' });
  }
});

module.exports = router;
