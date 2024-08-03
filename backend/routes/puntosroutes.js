const express = require('express');
const router = express.Router();
const { Sequelize } = require('sequelize');
const config = require('../config/config.json');
const puntos = require('../models/puntos');
const sequelize = new Sequelize(config.integradora.database, config.integradora.username, config.integradora.password, {
  host: config.integradora.host,
  dialect: 'mysql'
});
const Seleccion = require('../models/puntos')(sequelize, Sequelize);


router.post('/', async (req, res) => {
  const { idConfiguracion, puntos_x, puntos_y } = req.body;

  if (idConfiguracion === undefined || puntos_x === undefined || puntos_y === undefined) {
    return res.status(400).json({ error: 'Datos incompletos: idConfiguracion, puntos_x, y puntos_y son requeridos' });
  }

  try {
    const newPunto = await Seleccion.create({
      idConfiguracion,
      punto_X: puntos_x, 
      punto_Y: puntos_y  
    });

    res.status(201).json(newPunto);
  } catch (error) {
    console.error('Error al crear punto:', req.body, error);
    res.status(500).json({ error: req.body, error: 'Error al crear punto' });
  }
});


// GET para obtener todos los métodos de selección
router.get('/', async (req, res) => {
  try {
    const selecciones = await Seleccion.findAll();
    res.json(selecciones);
  } catch (error) {
    console.error('Error al obtener métodos de selección:', error);
    res.status(500).json({ error: 'Error al obtener métodos de selección' });
  }
});

// GET para obtener un método de selección por ID
router.get('/:id', async (req, res) => {
  try {
    const seleccion = await Seleccion.findByPk(req.params.id);
    if (seleccion) {
      res.json(seleccion);
    } else {
      res.status(404).json({ error: 'Método de selección no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener método de selección:', error);
    res.status(500).json({ error: 'Error al obtener método de selección' });
  }
});

// PUT para actualizar un método de selección por ID
router.put('/:id', async (req, res) => {
  const { idParametro, nombre_metodo } = req.body;
  try {
    const [updated] = await Seleccion.update({ idParametro, nombre_metodo }, {
      where: { idSeleccion: req.params.id }
    });
    if (updated) {
      const updatedSeleccion = await Seleccion.findByPk(req.params.id);
      res.status(200).json(updatedSeleccion);
    } else {
      res.status(404).json({ error: 'Método de selección no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar método de selección:', error);
    res.status(500).json({ error: 'Error al actualizar método de selección' });
  }
});

// DELETE para eliminar un método de selección por ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Seleccion.destroy({
      where: { idSeleccion: req.params.id }
    });
    if (deleted) {
      res.status(204).json({ message: 'Método de selección eliminado' });
    } else {
      res.status(404).json({ error: 'Método de selección no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar método de selección:', error);
    res.status(500).json({ error: 'Error al eliminar método de selección' });
  }
});

module.exports = router;
