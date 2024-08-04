// routes/enlaceroutes.js
const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const config = require("../config/config.json");
const sequelize = new Sequelize(
  config.integradora.database,
  config.integradora.username,
  config.integradora.password,
  {
    host: config.integradora.host,
    dialect: "mysql",
  }
);
const Link = require("../models/enlaces")(sequelize);

// GET todos los enlaces
router.get("/", async (req, res) => {
  try {
    const enlaces = await Link.findAll();
    if (enlaces.length > 0) {
      res.status(200).json(enlaces);
    } else {
      res.status(404).json(null);
    }
  } catch (error) {
    console.error("Error al obtener enlaces:", error);
    res.status(500).json({ error: "Error al obtener enlaces" });
  }
});

// GET enlaces por ID del tema
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    console.log(`Buscando enlaces para idTema: ${id}`); // Depuración
    const enlaces = await Link.findAll({
      where: { idTema: id }, // Suponiendo que 'idTema' es la columna en la tabla 'Link'
    });
    if (enlaces.length > 0) {
      res.status(200).json(enlaces);
    } else {
      res.status(404).json(null);
    }
  } catch (error) {
    console.error("Error al obtener enlaces por ID del tema:", error);
    res.status(500).json({ error: "Error al obtener enlaces por ID del tema" });
  }
});

// POST para agregar un nuevo Enlace
router.post("/", async (req, res) => {
  const { idTema, Enlace } = req.body;

  try {
    const newEnlace = await Link.create({ idTema: idTema, Enlace: Enlace });
    res.status(201).json(newEnlace);
  } catch (error) {
    console.error("Error al crear enlace:", error.message);
    res.status(500).json({ error: "Error al crear enlace" });
  }
});

// DELETE para eliminar un Enlace por ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const enlaceToDelete = await Link.findByPk(id);
    if (enlaceToDelete) {
      await enlaceToDelete.destroy();
      res.status(200).json({ message: "Enlace eliminado correctamente" });
    } else {
      res.status(404).json(null);
    }
  } catch (error) {
    console.error("Error al eliminar enlace:", error);
    res.status(500).json({ error: "Error al eliminar enlace" });
  }
});

module.exports = router;
