const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('detallesfacturas', {
    idItem: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idFactura: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'facturas',
        key: 'idFactura'
      }
    },
    idProducto: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'productos',
        key: 'idProducto'
      }
    },
    Cantidad: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1
    },
    Subtotal: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'detallesfacturas',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idItem" },
        ]
      },
      {
        name: "idFactura",
        using: "BTREE",
        fields: [
          { name: "idFactura" },
        ]
      },
      {
        name: "idProducto",
        using: "BTREE",
        fields: [
          { name: "idProducto" },
        ]
      },
    ]
  });
};
