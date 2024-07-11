const { Router } = require("express");
const { Sequelize, DataTypes } = require("sequelize");

const facturasRouter = Router();

// Configuración de la conexión a la base de datos
const sequelize = new Sequelize("facturacion", "root", "21042001", {
  host: "localhost",
  dialect: "mysql",
});

// Define el modelo de facturas
const Facturas = sequelize.define(
  "Facturas",
  {
    idFactura: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    NumeroFactura: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: "NumeroFactura",
    },
    idCliente: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "clientes",
        key: "idCliente",
      },
    },
    Subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    PorcentajeIGV: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    IGV: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    Total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    FechaCreacion: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    timestamps: false,
  }
);



// Obtener todas las facturas
facturasRouter.get("/", async (req, res) => {
  try {
    const facturas = await Facturas.findAll();
    res.json(facturas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las facturas" });
  }
});

// Obtener una factura por su ID
facturasRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const factura = await Facturas.findByPk(id);
    if (factura) {
      res.json(factura);
    } else {
      res.status(404).json({ message: "Factura no encontrada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener la factura" });
  }
});

// Crear una nueva factura
facturasRouter.post("/", async (req, res) => {
  const {NumeroFactura, idCliente, Subtotal,PorcentajeIGV, IGV, Total } = req.body;
  try {
    const nuevaFactura = await Facturas.create({
      NumeroFactura,
      idCliente,
      Subtotal,
      PorcentajeIGV,
      IGV,
      Total,
    });
    res.status(201).json(nuevaFactura);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear la factura" });
  }
});

// Actualizar una factura existente
facturasRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { NumeroFactura, idCliente, Subtotal,PorcentajeIGV, IGV, Total } = req.body;
  try {
    const factura = await Facturas.findByPk(id);
    if (factura) {
      factura.NumeroFactura = NumeroFactura;
      factura.idCliente = idCliente;
      factura.Subtotal = Subtotal;
      factura.PorcentajeIGV = PorcentajeIGV;
      factura.IGV = IGV;
      factura.Total = Total;
      await factura.save();
      res.json(factura);
    } else {
      res.status(404).json({ message: "Factura no encontrada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar la factura" });
  }
});

// Eliminar una factura
facturasRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const factura = await Facturas.findByPk(id);
    if (factura) {
      await factura.destroy();
      res.json({ message: "Factura eliminada correctamente" });
    } else {
      res.status(404).json({ message: "Factura no encontrada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar la factura" });
  }
});

module.exports = facturasRouter;
