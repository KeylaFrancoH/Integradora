// models/variable.js
const { DataTypes } = require('sequelize');

module.exports = function(sequelize) {
  return sequelize.define('Variable', {
    idVariable: {
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
    variable: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Variable',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'idVariable' }]
      }
    ]
  });
};
