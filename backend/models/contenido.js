// models/contenido.js
const { DataTypes } = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  const Contenido = sequelize.define('Contenido', {
    idContenido: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idCurso: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Curso', // Nombre de la tabla de la clave foránea
        key: 'idCurso'
      }
    },
    Titulo: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Contenido_descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'contenido',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'idContenido' }]
      }
    ]
  });

  return Contenido;
};
