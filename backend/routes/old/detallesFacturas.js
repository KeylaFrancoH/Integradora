const { Router } = require("express");
const { Sequelize, DataTypes } = require("sequelize");

const detallesFacturasRouter = Router();

// Configuración de la conexión a la base de datos
const sequelize = new Sequelize("facturacion", "root", "21042001", {
  host: "localhost",
  dialect: "mysql",
});

// Define el modelo de detalles de facturas
const DetallesFactura = sequelize.define("detallesfacturas", {
  idItem: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  idFactura: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  idProducto: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  }
}, {
  timestamps: false
});

// Middleware para obtener todos los detalles de facturas
detallesFacturasRouter.get("/", async (req, res) => {
  try {
    const detallesFacturas = await DetallesFactura.findAll();
    return res.json(detallesFacturas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Middleware para crear un nuevo detalle de factura
detallesFacturasRouter.post("/", async (req, res) => {
  try {
    const nuevoDetalleFactura = await DetallesFactura.create(req.body);
    return res.status(201).json(nuevoDetalleFactura);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Middleware para obtener un detalle de factura por su ID
detallesFacturasRouter.get("/:id", async (req, res) => {
  try {
    const detalleFactura = await DetallesFactura.findByPk(req.params.id);
    if (!detalleFactura) {
      return res.status(404).json({ error: "Detalle de factura no encontrado" });
    }
    return res.json(detalleFactura);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Middleware para obtener todos los detalles de factura por su idFactura
detallesFacturasRouter.get("/facturas/:idFactura", async (req, res) => {
  try {
    const idFactura = req.params.idFactura;
    // Busca los detalles de la factura especificada
    const detallesFactura = await DetallesFactura.findAll({
      where: { idFactura },
    });
    if (!detallesFactura || detallesFactura.length === 0) {
      return res.status(404).json({ message: "No se encontraron detalles para la factura proporcionada" });
    }
    return res.json(detallesFactura);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


// Middleware para actualizar un detalle de factura por su ID
detallesFacturasRouter.put("/:id", async (req, res) => {
  try {
    const detalleFactura = await DetallesFactura.findByPk(req.params.id);
    if (!detalleFactura) {
      return res.status(404).json({ error: "Detalle de factura no encontrado" });
    }
    await detalleFactura.update(req.body);
    return res.json(detalleFactura);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Middleware para eliminar un detalle de factura por su ID
detallesFacturasRouter.delete("/:id", async (req, res) => {
  try {
    const detalleFactura = await DetallesFactura.findByPk(req.params.id);
    if (!detalleFactura) {
      return res.status(404).json({ error: "Detalle de factura no encontrado" });
    }
    await detalleFactura.destroy();
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
// Middleware para eliminar todos los detalles de factura por su idFactura
detallesFacturasRouter.delete("/facturas/:idFactura", async (req, res) => {
  try {
    const idFactura = req.params.idFactura;
    await DetallesFactura.destroy({ where: { idFactura } });
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = detallesFacturasRouter;
