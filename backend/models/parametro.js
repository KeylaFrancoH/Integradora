// models/parametro.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config.json'); // Ajusta la ruta según tu estructura de archivos

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Parametro', {
    idParametro: {
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
    parametro: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    valor_parametro: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    valores_maximo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    tipo_seleccion: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'parametro',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'idParametro' }]
      }
    ]
  });
};
