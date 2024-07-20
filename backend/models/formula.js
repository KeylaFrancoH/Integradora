// models/formula.js
const { DataTypes } = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  const Formula = sequelize.define('Formula', {
    idFormula: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombreFormula: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    formula: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    idCurso: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'idCurso', // Nombre de la tabla de la clave foránea
        key: 'idCurso'
      }
    }
  }, {
    sequelize,
    tableName: 'formula',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'idFormula' }]
      }
    ]
  });

  return Formula;
};
