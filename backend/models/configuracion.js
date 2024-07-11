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
        model: 'Tema', // Nombre de la tabla de la clave foránea
        key: 'idTema'
      }
    },
    Parametros: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Titulo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Enumerado: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    intentos: {
      type: DataTypes.INTEGER,
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
