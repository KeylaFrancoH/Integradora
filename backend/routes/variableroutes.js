// routes/variableroutes.js
const express = require('express');
const router = express.Router();
const { Sequelize } = require('sequelize');
const config = require('../config/config.json');
const sequelize = new Sequelize(config.integradora.database, config.integradora.username, config.integradora.password, {
  host: config.integradora.host,
  dialect: 'mysql'
});
const Variable = require('../models/variable')(sequelize, Sequelize);

// POST para agregar una nueva variable
router.post('/', async (req, res) => {
  const { idConfiguracion, idEjercicio, nombre_variable, valor_variable } = req.body;
  try {
    const newVariable = await Variable.create({ idConfiguracion, idEjercicio, nombre_variable, valor_variable });
    res.status(201).json(newVariable);
  } catch (error) {
    console.error('Error al crear variable:', error);
    res.status(500).json({ error: 'Error al crear variable' });
  }
});

// GET para obtener todas las variables
router.get('/', async (req, res) => {
  try {
    const variables = await Variable.findAll();
    res.json(variables);
  } catch (error) {
    console.error('Error al obtener variables:', error);
    res.status(500).json({ error: 'Error al obtener variables' });
  }
});

// GET para obtener una variable por ID
router.get('/:id', async (req, res) => {
  try {
    const variable = await Variable.findByPk(req.params.id);
    if (variable) {
      res.json(variable);
    } else {
      res.status(404).json({ error: 'Variable no encontrada' });
    }
  } catch (error) {
    console.error('Error al obtener variable:', error);
    res.status(500).json({ error: 'Error al obtener variable' });
  }
});

// PUT para actualizar una variable por ID
router.put('/:id', async (req, res) => {
  const { idConfiguracion, idEjercicio, nombre_variable, valor_variable } = req.body;
  try {
    const [updated] = await Variable.update({ idConfiguracion, idEjercicio, nombre_variable, valor_variable }, {
      where: { idVariable: req.params.id }
    });
    if (updated) {
      const updatedVariable = await Variable.findByPk(req.params.id);
      res.status(200).json(updatedVariable);
    } else {
      res.status(404).json({ error: 'Variable no encontrada' });
    }
  } catch (error) {
    console.error('Error al actualizar variable:', error);
    res.status(500).json({ error: 'Error al actualizar variable' });
  }
});

// DELETE para eliminar una variable por ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Variable.destroy({
      where: { idVariable: req.params.id }
    });
    if (deleted) {
      res.status(204).json({ message: 'Variable eliminada' });
    } else {
      res.status(404).json({ error: 'Variable no encontrada' });
    }
  } catch (error) {
    console.error('Error al eliminar variable:', error);
    res.status(500).json({ error: 'Error al eliminar variable' });
  }
});

module.exports = router;
