// routes/temaroutes.js
const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const config = require('../config/config.json');
const sequelize = new Sequelize(config.integradora.database, config.integradora.username, config.integradora.password, {
  host: config.integradora.host,
  dialect: 'mysql'
});
const Tema = require('../models/tema')(sequelize, Sequelize);

// GET para obtener todos los temas
router.get('/', async (req, res) => {
  try {
    const temas = await Tema.findAll();
    res.json(temas);
  } catch (error) {
    console.error('Error al obtener temas:', error);
    res.status(500).json({ error: 'Error al obtener temas' });
  }
});

// GET para obtener un tema por ID
router.get('/:id', async (req, res) => {
  try {
    const tema = await Tema.findByPk(req.params.id);
    if (tema) {
      res.json(tema);
    } else {
      res.status(404).json({ error: 'Tema no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener tema:', error);
    res.status(500).json({ error: 'Error al obtener tema' });
  }
});

// POST para agregar un nuevo tema
router.post('/', async (req, res) => {
  const { idContenido, Titulo, Subtitulo, Material, Tipo } = req.body;
  try {
    const newTema = await Tema.create({ idContenido, Titulo, Subtitulo, Material, Tipo });
    res.status(201).json(newTema);
  } catch (error) {
    console.error('Error al crear tema:', error);
    res.status(500).json({ error: 'Error al crear tema' });
  }
});

// PUT para actualizar un tema por ID
router.put('/:id', async (req, res) => {
  const { idContenido, Titulo, Subtitulo, Material, Tipo } = req.body;
  try {
    const [updated] = await Tema.update({ idContenido, Titulo, Subtitulo, Material, Tipo }, {
      where: { idTema: req.params.id }
    });
    if (updated) {
      const updatedTema = await Tema.findByPk(req.params.id);
      res.status(200).json(updatedTema);
    } else {
      res.status(404).json({ error: 'Tema no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar tema:', error);
    res.status(500).json({ error: 'Error al actualizar tema' });
  }
});

// DELETE para eliminar un tema por ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Tema.destroy({
      where: { idTema: req.params.id }
    });
    if (deleted) {
      res.status(204).json({ message: 'Tema eliminado' });
    } else {
      res.status(404).json({ error: 'Tema no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar tema:', error);
    res.status(500).json({ error: 'Error al eliminar tema' });
  }
});

module.exports = router;
