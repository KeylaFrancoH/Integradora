// models/instruccion.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config.json'); // Ajusta la ruta según tu estructura de archivos

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Instruccion', {
    idInstrucciones: {
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
    Instrucciones: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    idCurso: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'curso',
        key: 'idCurso'
      }
    }
  }, {
    sequelize,
    tableName: 'instruccion',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'idInstrucciones' }]
      }
    ]
  });
};
