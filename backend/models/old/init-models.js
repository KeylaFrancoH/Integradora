var DataTypes = require("sequelize").DataTypes;
var _clientes = require("./clientes");
var _detallesfactura = require("./detallesfactura");
var _facturas = require("./facturas");
var _productos = require("./productos");
var _usuarios = require("./usuarios");

function initModels(sequelize) {
  var clientes = _clientes(sequelize, DataTypes);
  var detallesfactura = _detallesfactura(sequelize, DataTypes);
  var facturas = _facturas(sequelize, DataTypes);
  var productos = _productos(sequelize, DataTypes);
  var usuarios = _usuarios(sequelize, DataTypes);

  facturas.belongsTo(clientes, { as: "idCliente_cliente", foreignKey: "idCliente"});
  clientes.hasMany(facturas, { as: "facturas", foreignKey: "idCliente"});
  detallesfactura.belongsTo(facturas, { as: "idFactura_factura", foreignKey: "idFactura"});
  facturas.hasMany(detallesfactura, { as: "detallesfacturas", foreignKey: "idFactura"});
  detallesfactura.belongsTo(productos, { as: "idProducto_producto", foreignKey: "idProducto"});
  productos.hasMany(detallesfactura, { as: "detallesfacturas", foreignKey: "idProducto"});

  return {
    clientes,
    detallesfactura,
    facturas,
    productos,
    usuarios,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
