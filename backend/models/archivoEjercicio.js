// models/archivoEjercicio.js
const { DataTypes } = require('sequelize');

module.exports = function(sequelize) {
  return sequelize.define('ArchivoEjercicio', {
    idArchivoEjercicio: {
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
    idTema: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Tema',
        key: 'idTema'
      }
    },
    rutaArchivo: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ArchivoEjercicios',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'idArchivoEjercicio' }]
      }
    ]
  });
};
