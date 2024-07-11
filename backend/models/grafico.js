// models/grafico.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config.json'); // Ajusta la ruta según tu estructura de archivos

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Grafico', {
    idGrafico: {
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
    Tipo_grafico: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    etiqueta: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    }
  }, {
    sequelize,
    tableName: 'grafico', // Nombre exacto de la tabla en la base de datos
    timestamps: false, // Desactiva la creación automática de timestamps (createdAt, updatedAt)
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'idGrafico' }]
      },
      {
        name: 'fk_idConfiguracion',
        using: 'BTREE',
        fields: [{ name: 'idConfiguracion' }]
      }
    ]
  });
};
