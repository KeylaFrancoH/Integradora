// models/configuracionejercicio.js
const { DataTypes } = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  const ConfiguracionEjercicio = sequelize.define('ConfiguracionEjercicio', {
    idEjercicio: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idConfiguracion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Configuracion', // Nombre de la tabla de la clave foránea
        key: 'idConfiguracion'
      }
    },
    habilitado: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    variables_ejercicio: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    campo_ejercicios: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'configuracionejercicio',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'idEjercicio' }]
      }
    ]
  });

  return ConfiguracionEjercicio;
};
