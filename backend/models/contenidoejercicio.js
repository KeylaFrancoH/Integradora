const { DataTypes } = require('sequelize');
const sequelize = require('../config/config.json'); // Ajusta la ruta según tu estructura de archivos

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ContenidoEjercicio', {
    idContenidoEjercicios: {
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
    k_min: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    k_max: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    k_exacto: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    iteracion_min: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    iteracion_max: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    iteracion_exacto: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ContenidoEjercicios',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'idContenidoEjercicios' }]
      }
    ]
  });
};
