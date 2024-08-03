// models/puntos.js
const { DataTypes, Sequelize } = require('sequelize');
const config = require('../config/config.json'); // Ajusta la ruta según tu estructura de archivos

const sequelize = new Sequelize(config.integradora.database, config.integradora.username, config.integradora.password, {
  host: config.integradora.host,
  dialect: 'mysql'
});

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Puntos', {
    idPuntos: {
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
    punto_X: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    punto_Y: {
      type: DataTypes.DOUBLE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Puntos',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'idPuntos' }]
      }
    ]
  });
};
