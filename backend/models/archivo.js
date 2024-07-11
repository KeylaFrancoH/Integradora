// models/archivo.js
const { DataTypes } = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  const Archivo = sequelize.define('Archivo', {
    idArchivo: {
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
    Enlace: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    youtube: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    archivo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    idConfiguracion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Configuracion', // Nombre de la tabla de la clave foránea
        key: 'idConfiguracion'
      }
    }
  }, {
    sequelize,
    tableName: 'archivo',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'idArchivo' }]
      }
    ]
  });

  return Archivo;
};
