// models/parametro.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config'); 

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
        model: 'Configuracion', 
        key: 'idConfiguracion'
      }
    },
    formula: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    parametro_regularización: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    intercepto: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    metodo_inicialización: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    numero_clusters: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    numero_iteraciones: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Parametro',
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
