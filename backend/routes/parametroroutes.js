// routes/parametroroutes.js
const express = require('express');
const router = express.Router();
const { Sequelize } = require('sequelize');
const config = require('../config/config.json');
const sequelize = new Sequelize(config.integradora.database, config.integradora.username, config.integradora.password, {
  host: config.integradora.host,
  dialect: 'mysql'
});
const Parametro = require('../models/parametro')(sequelize, Sequelize);

// POST para agregar un nuevo parámetro
router.post('/', async (req, res) => {
  const { idConfiguracion, parametro, valor_parametro, valores_maximo, tipo_seleccion } = req.body;
  try {
    const newParametro = await Parametro.create({ idConfiguracion, parametro, valor_parametro, valores_maximo, tipo_seleccion });
    res.status(201).json(newParametro);
  } catch (error) {
    console.error('Error al crear parámetro:', error);
    res.status(500).json({ error: 'Error al crear parámetro' });
  }
});

// GET para obtener todos los parámetros
router.get('/', async (req, res) => {
  try {
    const parametros = await Parametro.findAll();
    res.json(parametros);
  } catch (error) {
    console.error('Error al obtener parámetros:', error);
    res.status(500).json({ error: 'Error al obtener parámetros' });
  }
});

// GET para obtener un parámetro por ID
router.get('/:id', async (req, res) => {
  try {
    const parametro = await Parametro.findByPk(req.params.id);
    if (parametro) {
      res.json(parametro);
    } else {
      res.status(404).json({ error: 'Parámetro no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener parámetro:', error);
    res.status(500).json({ error: 'Error al obtener parámetro' });
  }
});

// PUT para actualizar un parámetro por ID
router.put('/:id', async (req, res) => {
  const { idConfiguracion, parametro, valor_parametro, valores_maximo, tipo_seleccion } = req.body;
  try {
    const [updated] = await Parametro.update({ idConfiguracion, parametro, valor_parametro, valores_maximo, tipo_seleccion }, {
      where: { idParametro: req.params.id }
    });
    if (updated) {
      const updatedParametro = await Parametro.findByPk(req.params.id);
      res.status(200).json(updatedParametro);
    } else {
      res.status(404).json({ error: 'Parámetro no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar parámetro:', error);
    res.status(500).json({ error: 'Error al actualizar parámetro' });
  }
});

// DELETE para eliminar un parámetro por ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Parametro.destroy({
      where: { idParametro: req.params.id }
    });
    if (deleted) {
      res.status(204).json({ message: 'Parámetro eliminado' });
    } else {
      res.status(404).json({ error: 'Parámetro no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar parámetro:', error);
    res.status(500).json({ error: 'Error al eliminar parámetro' });
  }
});

module.exports = router;
