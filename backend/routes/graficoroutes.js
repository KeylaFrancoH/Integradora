// routes/graficoroutes.js
const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const config = require('../config/config.json');
const sequelize = new Sequelize(config.integradora.database, config.integradora.username, config.integradora.password, {
  host: config.integradora.host,
  dialect: 'mysql'
});
const Grafico = require('../models/grafico')(sequelize, Sequelize);

// GET para obtener todos los gráficos
router.get('/', async (req, res) => {
  try {
    const graficos = await Grafico.findAll();
    res.json(graficos);
  } catch (error) {
    console.error('Error al obtener gráficos:', error);
    res.status(500).json({ error: 'Error al obtener gráficos' });
  }
});

// GET para obtener un gráfico por ID
router.get('/:id', async (req, res) => {
  try {
    const grafico = await Grafico.findByPk(req.params.id);
    if (grafico) {
      res.json(grafico);
    } else {
      res.status(404).json({ error: 'Gráfico no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener gráfico:', error);
    res.status(500).json({ error: 'Error al obtener gráfico' });
  }
});

// POST para agregar un nuevo gráfico
router.post('/', async (req, res) => {
  const { idConfiguracion, Tipo_grafico, etiqueta } = req.body;
  try {
    const newGrafico = await Grafico.create({ idConfiguracion, Tipo_grafico, etiqueta });
    res.status(201).json(newGrafico);
  } catch (error) {
    console.error('Error al crear gráfico:', error);
    res.status(500).json({ error: 'Error al crear gráfico' });
  }
});

// PUT para actualizar un gráfico por ID
router.put('/:id', async (req, res) => {
  const { idConfiguracion, Tipo_grafico, etiqueta } = req.body;
  try {
    const [updated] = await Grafico.update({ idConfiguracion, Tipo_grafico, etiqueta }, {
      where: { idGrafico: req.params.id }
    });
    if (updated) {
      const updatedGrafico = await Grafico.findByPk(req.params.id);
      res.status(200).json(updatedGrafico);
    } else {
      res.status(404).json({ error: 'Gráfico no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar gráfico:', error);
    res.status(500).json({ error: 'Error al actualizar gráfico' });
  }
});

// DELETE para eliminar un gráfico por ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Grafico.destroy({
      where: { idGrafico: req.params.id }
    });
    if (deleted) {
      res.status(204).json({ message: 'Gráfico eliminado' });
    } else {
      res.status(404).json({ error: 'Gráfico no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar gráfico:', error);
    res.status(500).json({ error: 'Error al eliminar gráfico' });
  }
});

module.exports = router;
