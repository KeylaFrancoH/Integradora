// routes/contenidoroutes.js
const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const config = require('../config/config.json');
const sequelize = new Sequelize(config.integradora.database, config.integradora.username, config.integradora.password, {
  host: config.integradora.host,
  dialect: 'mysql'
});
const Contenido = require('../models/contenido')(sequelize, Sequelize);

// GET para obtener todos los contenidos
router.get('/', async (req, res) => {
  try {
    const contenidos = await Contenido.findAll();
    res.json(contenidos);
  } catch (error) {
    console.error('Error al obtener contenidos:', error);
    res.status(500).json({ error: 'Error al obtener contenidos' });
  }
});

// GET para obtener un contenido por ID
router.get('/:id', async (req, res) => {
  try {
    const contenido = await Contenido.findByPk(req.params.id);
    if (contenido) {
      res.json(contenido);
    } else {
      res.status(404).json({ error: 'Contenido no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener contenido:', error);
    res.status(500).json({ error: 'Error al obtener contenido' });
  }
});

// POST para agregar un nuevo contenido
router.post('/', async (req, res) => {
  const { idCurso, Titulo, Contenido_descripcion } = req.body;
  try {
    const newContenido = await Contenido.create({ idCurso, Titulo, Contenido_descripcion });
    res.status(201).json(newContenido);
  } catch (error) {
    console.error('Error al crear contenido:', error);
    res.status(500).json({ error: 'Error al crear contenido' });
  }
});

// PUT para actualizar un contenido por ID
router.put('/:id', async (req, res) => {
  const { idCurso, Titulo, Contenido_descripcion } = req.body;
  try {
    const [updated] = await Contenido.update({ idCurso, Titulo, Contenido_descripcion }, {
      where: { idContenido: req.params.id }
    });
    if (updated) {
      const updatedContenido = await Contenido.findByPk(req.params.id);
      res.status(200).json(updatedContenido);
    } else {
      res.status(404).json({ error: 'Contenido no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar contenido:', error);
    res.status(500).json({ error: 'Error al actualizar contenido' });
  }
});

// DELETE para eliminar un contenido por ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Contenido.destroy({
      where: { idContenido: req.params.id }
    });
    if (deleted) {
      res.status(204).json({ message: 'Contenido eliminado' });
    } else {
      res.status(404).json({ error: 'Contenido no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar contenido:', error);
    res.status(500).json({ error: 'Error al eliminar contenido' });
  }
});

module.exports = router;
