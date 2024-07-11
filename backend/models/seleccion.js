// models/seleccion.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config.json'); // Ajusta la ruta según tu estructura de archivos

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Seleccion', {
    idSeleccion: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idParametro: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'parametro',
        key: 'idParametro'
      }
    },
    nombre_metodo: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'seleccion',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'idSeleccion' }]
      }
    ]
  });
};
