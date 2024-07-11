// models/curso.js
const { DataTypes } = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Curso', {
    idCurso: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Titulo: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'curso',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'idCurso' }]
      }
    ]
  });
};
