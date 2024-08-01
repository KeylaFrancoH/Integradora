// models/enlace.js
const { DataTypes } = require('sequelize');

module.exports = function(sequelize) {
  const Enlace = sequelize.define('Enlaces', {
    idEnlace: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idTema: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Tema',
        key: 'idTema'
      }
    },
    Enlace: { 
      type: DataTypes.TEXT,
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'Enlaces',
    timestamps: false,
  });

  return Enlace;
};
