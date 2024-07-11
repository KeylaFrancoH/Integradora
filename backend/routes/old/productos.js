const { Router } = require("express");
const { Sequelize, DataTypes } = require("sequelize");

const productosRouter = Router();

// Configuración de la conexión a la base de datos
const sequelize = new Sequelize("facturacion", "root", "21042001", {
  host: "localhost",
  dialect: "mysql",
});

// Define el modelo de productos
const Productos = sequelize.define(
  "Productos",
  {
    idProducto: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    Nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Codigo: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    Precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    Stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Activo: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 1,
    },
    FechaCreacion: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    timestamps: false,
  }
);

// Ruta para obtener todos los productos

productosRouter.get("/", async (req, res) => {
  try {
    const productos = await Productos.findAll();
    const productosFormateados = productos.map((product) => ({
      ...product.dataValues,
      FechaCreacion: formatDate(product.FechaCreacion),
    }));
    res.json(productosFormateados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los productos" });
  }
});

// Ruta para obtener un producto por su ID
productosRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await Productos.findByPk(id);
    if (producto) {
      res.json(producto);
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error:
        "Error al obtener el producto, es posible que el código ingresado ya esté en uso",
    });
  }
});

// Ruta para crear un nuevo producto
productosRouter.post("/", async (req, res) => {
  const { Codigo, Nombre, Precio, Stock } = req.body;
  try {
    const existingProducto = await Productos.findOne({ where: { Codigo } });
    if (existingProducto) {
      return res.status(400).json({ message: "El código ya está en uso" });
    }
    const producto = await Productos.create({ Codigo, Nombre, Precio, Stock });
    return res.status(201).json(producto);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al crear el producto" });
  }
});

// Ruta para actualizar un producto
productosRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { Codigo, Nombre, Precio, Stock, Activo } = req.body;
  try {
    const producto = await Productos.findByPk(id);
    if (producto) {
      producto.Codigo = Codigo;
      producto.Nombre = Nombre;
      producto.Precio = Precio;
      producto.Stock = Stock;
      producto.Activo = Activo;
      await producto.save();
      res.json(producto);
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el producto" });
  }
});

// Ruta para eliminar un producto
productosRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await Productos.findByPk(id);
    if (producto) {
      await producto.destroy();
      res.json({ message: "Producto eliminado correctamente" });
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar el producto" });
  }
});
function formatDate(date) {
  return new Date(date).toISOString().slice(0, 10);
}
module.exports = productosRouter;
