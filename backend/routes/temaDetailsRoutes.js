// routes/temaDetailsRoutes.js
const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const config = require('../config/config.json');
const sequelize = new Sequelize(config.integradora.database, config.integradora.username, config.integradora.password, {
  host: config.integradora.host,
  dialect: 'mysql'
});

// Importa los modelos
const Archivo = require('../models/archivo')(sequelize, Sequelize);
const Configuracion = require('../models/configuracion')(sequelize, Sequelize);
const Parametro = require('../models/parametro')(sequelize, Sequelize);
const Variable = require('../models/variable')(sequelize, Sequelize);
const Puntos = require('../models/puntos')(sequelize, Sequelize);
const ArchivoEjercicio = require('../models/archivoEjercicio')(sequelize, Sequelize);

// Define las relaciones entre los modelos
Configuracion.belongsTo(Archivo, { foreignKey: 'idTema' });
Parametro.belongsTo(Configuracion, { foreignKey: 'idConfiguracion' });
Variable.belongsTo(Configuracion, { foreignKey: 'idConfiguracion' });
Puntos.belongsTo(Configuracion, { foreignKey: 'idConfiguracion' });
ArchivoEjercicio.belongsTo(Configuracion, { foreignKey: 'idConfiguracion' });

// GET para obtener todos los campos asociados al idTema
router.get('/:idTema', async (req, res) => {
  const idTema = req.params.idTema;

  try {
    const archivos = await Archivo.findAll({ where: { idTema } });
    const configuraciones = await Configuracion.findAll({ where: { idTema } });
    
    // Usar Promise.all para obtener todos los datos relacionados
    const [parametros, variables, puntos, archivoEjercicios] = await Promise.all([
      Parametro.findAll({ where: { idConfiguracion: configuraciones.map(c => c.idConfiguracion) } }),
      Variable.findAll({ where: { idConfiguracion: configuraciones.map(c => c.idConfiguracion) } }),
      Puntos.findAll({ where: { idConfiguracion: configuraciones.map(c => c.idConfiguracion) } }),
      ArchivoEjercicio.findAll({ where: { idTema } })
    ]);

    res.json({
      archivos,
      configuraciones,
      parametros,
      variables,
      puntos,
      archivoEjercicios
    });
  } catch (error) {
    console.error('Error al obtener detalles del tema:', error);
    res.status(500).json({ error: 'Error al obtener detalles del tema' });
  }
});

module.exports = router;
