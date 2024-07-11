const { DataTypes } = require('sequelize');
const sequelize = require('../config/config.json'); // Ajusta la ruta según tu estructura de archivos

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Usuario', {
    idUsuario: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Apellido: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Correo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    Contrasena: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    idAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'usuario', // Nombre exacto de la tabla en la base de datos
    timestamps: false, // Desactiva la creación automática de timestamps (createdAt, updatedAt)
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'idUsuario' }]
      }
    ]
  });
};
