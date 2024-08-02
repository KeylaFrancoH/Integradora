// routes/configuracionroutes.js
const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const config = require('../config/config.json');
const sequelize = new Sequelize(config.integradora.database, config.integradora.username, config.integradora.password, {
  host: config.integradora.host,
  dialect: 'mysql'
});
const Configuracion = require('../models/configuracion')(sequelize, Sequelize);

// GET para obtener todas las configuraciones
router.get('/', async (req, res) => {
  try {
    const configuraciones = await Configuracion.findAll();
    res.json(configuraciones);
  } catch (error) {
    console.error('Error al obtener configuraciones:', error);
    res.status(500).json({ error: 'Error al obtener configuraciones' });
  }
});

// GET para obtener una configuración por ID
router.get('/:id', async (req, res) => {
  try {
    const configuracion = await Configuracion.findByPk(req.params.id);
    if (configuracion) {
      res.json(configuracion);
    } else {
      res.status(404).json({ error: 'Configuración no encontrada' });
    }
  } catch (error) {
    console.error('Error al obtener configuración:', error);
    res.status(500).json({ error: 'Error al obtener configuración' });
  }
});

// POST para agregar una nueva configuración
router.post('/', async (req, res) => {
  const { idTema, Titulo, Enunciado, idFormula, idGrafico, habilitado, intentos, instrucciones } = req.body;
  try {
    const newConfiguracion = await Configuracion.create({ idTema, Titulo, Enunciado, idFormula, idGrafico, habilitado, intentos, instrucciones });
    res.status(201).json(newConfiguracion);
  } catch (error) {
    console.error('Error al crear configuración:', error);
    res.status(500).json({ error: 'Error al crear configuración' });
  }
});

// PUT para actualizar una configuración por ID
router.put('/:id', async (req, res) => {
  const { idTema, Titulo, Enunciado, idFormula, idGrafico, habilitado, intentos, instrucciones } = req.body;
  try {
    const [updated] = await Configuracion.update({ idTema, Titulo, Enunciado, idFormula, idGrafico, habilitado, intentos, instrucciones }, {
      where: { idConfiguracion: req.params.id }
    });
    if (updated) {
      const updatedConfiguracion = await Configuracion.findByPk(req.params.id);
      res.status(200).json(updatedConfiguracion);
    } else {
      res.status(404).json({ error: 'Configuración no encontrada' });
    }
  } catch (error) {
    console.error('Error al actualizar configuración:', error);
    res.status(500).json({ error: 'Error al actualizar configuración' });
  }
});

// DELETE para eliminar una configuración por ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Configuracion.destroy({
      where: { idConfiguracion: req.params.id }
    });
    if (deleted) {
      res.status(204).json({ message: 'Configuración eliminada' });
    } else {
      res.status(404).json({ error: 'Configuración no encontrada' });
    }
  } catch (error) {
    console.error('Error al eliminar configuración:', error);
    res.status(500).json({ error: 'Error al eliminar configuración' });
  }
});

module.exports = router;
