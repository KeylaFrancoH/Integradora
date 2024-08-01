// models/archivo.js
const { DataTypes } = require('sequelize');

module.exports = function(sequelize, DataTypes) {
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
      type: DataTypes.STRING(255),
      allowNull: true
    },
   
  }, {
    sequelize,
    tableName: 'enlaces',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'idEnlace' }]
      }
    ]
  });

  return Enlace;
};
