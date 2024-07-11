// routes/cursoroutes.js
const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const config = require('../config/config.json');
const sequelize = new Sequelize(config.integradora.database, config.integradora.username, config.integradora.password, {
  host: config.integradora.host,
  dialect: 'mysql'
});
const Curso = require('../models/curso')(sequelize, Sequelize);

// GET para obtener todos los cursos
router.get('/', async (req, res) => {
  try {
    const cursos = await Curso.findAll();
    res.json(cursos);
  } catch (error) {
    console.error('Error al obtener cursos:', error);
    res.status(500).json({ error: 'Error al obtener cursos' });
  }
});

// GET para obtener un curso por ID
router.get('/:id', async (req, res) => {
  try {
    const curso = await Curso.findByPk(req.params.id);
    if (curso) {
      res.json(curso);
    } else {
      res.status(404).json({ error: 'Curso no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener curso:', error);
    res.status(500).json({ error: 'Error al obtener curso' });
  }
});

// POST para agregar un nuevo curso
router.post('/', async (req, res) => {
  const { Titulo, Descripcion } = req.body;
  try {
    const newCurso = await Curso.create({ Titulo, Descripcion });
    res.status(201).json(newCurso);
  } catch (error) {
    console.error('Error al crear curso:', error);
    res.status(500).json({ error: 'Error al crear curso' });
  }
});

// PUT para actualizar un curso por ID
router.put('/:id', async (req, res) => {
  const { Titulo, Descripcion } = req.body;
  try {
    const [updated] = await Curso.update({ Titulo, Descripcion }, {
      where: { idCurso: req.params.id }
    });
    if (updated) {
      const updatedCurso = await Curso.findByPk(req.params.id);
      res.status(200).json(updatedCurso);
    } else {
      res.status(404).json({ error: 'Curso no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar curso:', error);
    res.status(500).json({ error: 'Error al actualizar curso' });
  }
});

// DELETE para eliminar un curso por ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Curso.destroy({
      where: { idCurso: req.params.id }
    });
    if (deleted) {
      res.status(204).json({ message: 'Curso eliminado' });
    } else {
      res.status(404).json({ error: 'Curso no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar curso:', error);
    res.status(500).json({ error: 'Error al eliminar curso' });
  }
});

module.exports = router;
