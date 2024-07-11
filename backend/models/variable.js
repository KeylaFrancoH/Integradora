// models/variable.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config.json'); // Ajusta la ruta según tu estructura de archivos

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Variable', {
    idVariable: {
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
    valor_variable: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'variable',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'idVariable' }]
      }
    ]
  });
};
