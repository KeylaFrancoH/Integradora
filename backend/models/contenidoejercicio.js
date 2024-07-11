// models/contenidoejercicio.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config.json'); // Ajusta la ruta según tu estructura de archivos

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ContenidoEjercicio', {
    idContenido: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idConfiguracion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'configuracion',
        key: 'idConfiguracion'
      }
    },
    idEjercicio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'configuracionejercicio',
        key: 'idEjercicio'
      }
    },
    nombre_variable: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    nuevo_valor: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'contenidoejercicio',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'idContenido' }]
      }
    ]
  });
};
