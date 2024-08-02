// routes/configuracionejercicioroutes.js
const express = require('express');
const router = express.Router();
const { Sequelize } = require('sequelize');
const config = require('../config/config.json');
const sequelize = new Sequelize(config.integradora.database, config.integradora.username, config.integradora.password, {
  host: config.integradora.host,
  dialect: 'mysql'
});
const ConfiguracionEjercicio = require('../models/configuracionejercicio')(sequelize, Sequelize);

// GET todos las configuraciones de ejercicio
router.get('/', async (req, res) => {
  try {
    const configuraciones = await ConfiguracionEjercicio.findAll();
    res.status(200).json(configuraciones);
  } catch (error) {
    console.error('Error al obtener configuraciones de ejercicio:', error);
    res.status(500).json({ error: 'Error al obtener configuraciones de ejercicio' });
  }
});

// GET una configuración de ejercicio por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const configuracion = await ConfiguracionEjercicio.findByPk(id);
    if (configuracion) {
      res.status(200).json(configuracion);
    } else {
      res.status(404).json({ error: 'Configuración de ejercicio no encontrada' });
    }
  } catch (error) {
    console.error('Error al obtener configuración de ejercicio por ID:', error);
    res.status(500).json({ error: 'Error al obtener configuración de ejercicio por ID' });
  }
});

// POST para agregar una nueva configuración de ejercicio
router.post('/', async (req, res) => {
  const { idConfiguracion, grafica, habilitado } = req.body;
  try {
    const newConfiguracion = await ConfiguracionEjercicio.create({ idConfiguracion, grafica, habilitado });
    res.status(201).json(newConfiguracion);
  } catch (error) {
    console.error('Error al crear configuración de ejercicio:', error);
    res.status(500).json({ error: 'Error al crear configuración de ejercicio' });
  }
});

// PUT para actualizar una configuración de ejercicio existente
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { idConfiguracion, grafica, habilitado } = req.body;
  try {
    const configuracionToUpdate = await ConfiguracionEjercicio.findByPk(id);
    if (configuracionToUpdate) {
      configuracionToUpdate.idConfiguracion = idConfiguracion;
      configuracionToUpdate.grafica = grafica;
      configuracionToUpdate.habilitado = habilitado;
      await configuracionToUpdate.save();
      res.status(200).json(configuracionToUpdate);
    } else {
      res.status(404).json({ error: 'Configuración de ejercicio no encontrada' });
    }
  } catch (error) {
    console.error('Error al actualizar configuración de ejercicio:', error);
    res.status(500).json({ error: 'Error al actualizar configuración de ejercicio' });
  }
});

// DELETE para eliminar una configuración de ejercicio por ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const configuracionToDelete = await ConfiguracionEjercicio.findByPk(id);
    if (configuracionToDelete) {
      await configuracionToDelete.destroy();
      res.status(200).json({ message: 'Configuración de ejercicio eliminada correctamente' });
    } else {
      res.status(404).json({ error: 'Configuración de ejercicio no encontrada' });
    }
  } catch (error) {
    console.error('Error al eliminar configuración de ejercicio:', error);
    res.status(500).json({ error: 'Error al eliminar configuración de ejercicio' });
  }
});

module.exports = router;
