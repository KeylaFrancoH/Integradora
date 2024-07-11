// routes/instruccionroutes.js
const express = require('express');
const router = express.Router();
const { Sequelize } = require('sequelize');
const config = require('../config/config.json');
const sequelize = new Sequelize(config.integradora.database, config.integradora.username, config.integradora.password, {
  host: config.integradora.host,
  dialect: 'mysql'
});
const Instruccion = require('../models/instruccion')(sequelize, Sequelize);

// POST para agregar una nueva instrucción
router.post('/', async (req, res) => {
  const { idConfiguracion, Instrucciones, idCurso } = req.body;
  try {
    const newInstruccion = await Instruccion.create({ idConfiguracion, Instrucciones, idCurso });
    res.status(201).json(newInstruccion);
  } catch (error) {
    console.error('Error al crear instrucción:', error);
    res.status(500).json({ error: 'Error al crear instrucción' });
  }
});

// GET para obtener todas las instrucciones
router.get('/', async (req, res) => {
  try {
    const instrucciones = await Instruccion.findAll();
    res.json(instrucciones);
  } catch (error) {
    console.error('Error al obtener instrucciones:', error);
    res.status(500).json({ error: 'Error al obtener instrucciones' });
  }
});

// GET para obtener una instrucción por ID
router.get('/:id', async (req, res) => {
  try {
    const instruccion = await Instruccion.findByPk(req.params.id);
    if (instruccion) {
      res.json(instruccion);
    } else {
      res.status(404).json({ error: 'Instrucción no encontrada' });
    }
  } catch (error) {
    console.error('Error al obtener instrucción:', error);
    res.status(500).json({ error: 'Error al obtener instrucción' });
  }
});

// PUT para actualizar una instrucción por ID
router.put('/:id', async (req, res) => {
  const { idConfiguracion, Instrucciones, idCurso } = req.body;
  try {
    const [updated] = await Instruccion.update({ idConfiguracion, Instrucciones, idCurso }, {
      where: { idInstrucciones: req.params.id }
    });
    if (updated) {
      const updatedInstruccion = await Instruccion.findByPk(req.params.id);
      res.status(200).json(updatedInstruccion);
    } else {
      res.status(404).json({ error: 'Instrucción no encontrada' });
    }
  } catch (error) {
    console.error('Error al actualizar instrucción:', error);
    res.status(500).json({ error: 'Error al actualizar instrucción' });
  }
});

// DELETE para eliminar una instrucción por ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Instruccion.destroy({
      where: { idInstrucciones: req.params.id }
    });
    if (deleted) {
      res.status(204).json({ message: 'Instrucción eliminada' });
    } else {
      res.status(404).json({ error: 'Instrucción no encontrada' });
    }
  } catch (error) {
    console.error('Error al eliminar instrucción:', error);
    res.status(500).json({ error: 'Error al eliminar instrucción' });
  }
});

module.exports = router;
