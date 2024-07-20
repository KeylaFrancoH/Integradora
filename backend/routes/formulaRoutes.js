// routes/formularoutes.js
const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const config = require('../config/config.json');
const sequelize = new Sequelize(config.integradora.database, config.integradora.username, config.integradora.password, {
  host: config.integradora.host,
  dialect: 'mysql'
});
const Formula = require('../models/formula')(sequelize, Sequelize);

// GET todos las fórmulas
router.get('/', async (req, res) => {
  try {
    const formulas = await Formula.findAll();
    res.status(200).json(formulas);
  } catch (error) {
    console.error('Error al obtener fórmulas:', error);
    res.status(500).json({ error: 'Error al obtener fórmulas' });
  }
});

// GET una fórmula por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const formula = await Formula.findByPk(id);
    if (formula) {
      res.status(200).json(formula);
    } else {
      res.status(404).json({ error: 'Fórmula no encontrada' });
    }
  } catch (error) {
    console.error('Error al obtener fórmula por ID:', error);
    res.status(500).json({ error: 'Error al obtener fórmula por ID' });
  }
});

// POST para agregar una nueva fórmula
router.post('/', async (req, res) => {
  const { nombreFormula, formula, idCurso } = req.body;
  try {
    const newFormula = await Formula.create({ nombreFormula, formula, idCurso });
    res.status(201).json(newFormula);
  } catch (error) {
    console.error('Error al crear fórmula:', error);
    res.status(500).json({ error: 'Error al crear fórmula' });
  }
});

// PUT para actualizar una fórmula existente
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombreFormula, formula, idCurso } = req.body;
  try {
    const formulaToUpdate = await Formula.findByPk(id);
    if (formulaToUpdate) {
      formulaToUpdate.nombreFormula = nombreFormula;
      formulaToUpdate.formula = formula;
      formulaToUpdate.idCurso = idCurso;
      await formulaToUpdate.save();
      res.status(200).json(formulaToUpdate);
    } else {
      res.status(404).json({ error: 'Fórmula no encontrada' });
    }
  } catch (error) {
    console.error('Error al actualizar fórmula:', error);
    res.status(500).json({ error: 'Error al actualizar fórmula' });
  }
});

// DELETE para eliminar una fórmula por ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const formulaToDelete = await Formula.findByPk(id);
    if (formulaToDelete) {
      await formulaToDelete.destroy();
      res.status(200).json({ message: 'Fórmula eliminada correctamente' });
    } else {
      res.status(404).json({ error: 'Fórmula no encontrada' });
    }
  } catch (error) {
    console.error('Error al eliminar fórmula:', error);
    res.status(500).json({ error: 'Error al eliminar fórmula' });
  }
});

module.exports = router;
