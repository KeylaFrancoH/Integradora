const express = require('express');
const router = express.Router();
const { Sequelize } = require('sequelize');
const config = require('../config/config.json');
const sequelize = new Sequelize(
  config.integradora.database,
  config.integradora.username,
  config.integradora.password,
  {
    host: config.integradora.host,
    dialect: 'mysql'
  }
);
const ArchivoEjercicio = require('../models/archivoEjercicio')(sequelize, Sequelize);

// POST para agregar un nuevo archivo de ejercicio
router.post('/', async (req, res) => {
  const { idConfiguracion, idTema, rutaArchivo, descripcion } = req.body;

  if (!idConfiguracion || !idTema || !rutaArchivo) {
    return res.status(400).json({ error: 'idConfiguracion, idTema y rutaArchivo son requeridos' });
  }

  try {
    const newArchivoEjercicio = await ArchivoEjercicio.create({
      idConfiguracion,
      idTema,
      rutaArchivo,
      descripcion: descripcion || null
    });
    res.status(201).json(newArchivoEjercicio);
  } catch (error) {
    console.error('Error al crear archivo de ejercicio:', error);
    res.status(500).json({ error: 'Error al crear archivo de ejercicio' });
  }
});

// GET para obtener todos los archivos de ejercicios
router.get('/', async (req, res) => {
  try {
    const archivos = await ArchivoEjercicio.findAll();
    res.json(archivos);
  } catch (error) {
    console.error('Error al obtener archivos de ejercicios:', error);
    res.status(500).json({ error: 'Error al obtener archivos de ejercicios' });
  }
});

router.get('/buscar', async (req, res) => {
  const { idTema, idConfiguracion } = req.query;

  if (!idTema || !idConfiguracion) {
    return res.status(400).json({ error: 'idTema e idConfiguracion son requeridos' });
  }

  try {
    const archivos = await ArchivoEjercicio.findAll({
      where: {
        idTema: idTema,
        idConfiguracion: idConfiguracion
      }
    });

    if (archivos.length > 0) {
      res.status(200).json(archivos);
    } else {
      res.status(200).json([]);  
    }
  } catch (error) {
    console.error('Error al obtener archivos por idTema e idConfiguracion:', error);
    res.status(500).json({ error: 'Error al obtener archivos por idTema e idConfiguracion' });
  }
});

// GET para obtener un archivo de ejercicio por ID
router.get('/:id', async (req, res) => {
  try {
    const archivo = await ArchivoEjercicio.findByPk(req.params.id);
    if (archivo) {
      res.json(archivo);
    } else {
      res.status(404).json({ error: 'Archivo de ejercicio no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener archivo de ejercicio:', error);
    res.status(500).json({ error: 'Error al obtener archivo de ejercicio' });
  }
});

// PUT para actualizar un archivo de ejercicio por ID
router.put('/:id', async (req, res) => {
  const { idConfiguracion, idTema, rutaArchivo, descripcion } = req.body;

  if (!idConfiguracion || !idTema || !rutaArchivo) {
    return res.status(400).json({ error: 'idConfiguracion, idTema y rutaArchivo son requeridos' });
  }

  try {
    const [updated] = await ArchivoEjercicio.update(
      { idConfiguracion, idTema, rutaArchivo, descripcion },
      { where: { idArchivoEjercicio: req.params.id } }
    );

    if (updated) {
      const updatedArchivo = await ArchivoEjercicio.findByPk(req.params.id);
      res.status(200).json(updatedArchivo);
    } else {
      res.status(404).json({ error: 'Archivo de ejercicio no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar archivo de ejercicio:', error);
    res.status(500).json({ error: 'Error al actualizar archivo de ejercicio' });
  }
});

// DELETE para eliminar un archivo de ejercicio por ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await ArchivoEjercicio.destroy({
      where: { idArchivoEjercicio: req.params.id }
    });
    if (deleted) {
      res.status(204).json({ message: 'Archivo de ejercicio eliminado' });
    } else {
      res.status(404).json({ error: 'Archivo de ejercicio no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar archivo de ejercicio:', error);
    res.status(500).json({ error: 'Error al eliminar archivo de ejercicio' });
  }
});

module.exports = router;
