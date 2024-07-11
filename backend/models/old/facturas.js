const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('facturas', {
    idFactura: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    NumeroFactura: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: "NumeroFactura"
    },
    idCliente: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'clientes',
        key: 'idCliente'
      }
    },
    Subtotal: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    PorcentajeIGV: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true
    },
    IGV: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    Total: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    FechaCreacion: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'facturas',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idFactura" },
        ]
      },
      {
        name: "NumeroFactura",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "NumeroFactura" },
        ]
      },
      {
        name: "idCliente",
        using: "BTREE",
        fields: [
          { name: "idCliente" },
        ]
      },
    ]
  });
};
