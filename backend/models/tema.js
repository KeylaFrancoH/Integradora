// models/tema.js
const { DataTypes } = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  const Tema = sequelize.define('Tema', {
    idTema: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idContenido: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Contenido', // Nombre de la tabla de la clave foránea
        key: 'idContenido'
      }
    },
    Titulo: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Subtitulo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Material: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Tipo: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tema',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'idTema' }]
      }
    ]
  });

  return Tema;
};
