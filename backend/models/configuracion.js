// models/configuracion.js
const { DataTypes } = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  const Configuracion = sequelize.define('Configuracion', {
    idConfiguracion: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idTema: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Tema', // Referencia a la tabla Tema
        key: 'idTema'
      }
    },
    Titulo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Enunciado: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    idFormula: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Formula', // Referencia a la tabla Formula
        key: 'idFormula'
      }
    },
    idGrafico: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Grafico', // Referencia a la tabla Grafico
        key: 'idGrafico'
      }
    },
    habilitado: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    intentos: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    instrucciones: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'configuracion',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'idConfiguracion' }]
      }
    ]
  });

  return Configuracion;
};
