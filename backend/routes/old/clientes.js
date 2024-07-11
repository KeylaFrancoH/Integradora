const { Router } = require('express');
const { Sequelize, DataTypes } = require('sequelize');

// Crea un nuevo router
const clientesRouter = Router();

// Configuración de la conexión a la base de datos
const sequelize = new Sequelize('facturacion', 'root', '21042001', {
  host: 'localhost',
  dialect: 'mysql'
});

// Define el modelo de cliente
const Clientes = sequelize.define('Clientes', {
  idCliente: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  RucDni: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  Nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  Direccion: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  Correo: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  Activo: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: 1
  },
  FechaCreacion: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  }
}, {
  timestamps: false
});

// Middleware para obtener todos los clientes
clientesRouter.get("/", async (req, res) => {
  try {
    const clientes = await Clientes.findAll();
    const clientesFormateados = clientes.map(cliente => ({
      ...cliente.dataValues,
      FechaCreacion: formatDate(cliente.FechaCreacion)
    }));
    return res.json(clientesFormateados);
  } catch (error) {
    console.error("Error al obtener los clientes:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
});

// Middleware para obtener un cliente por su ID
clientesRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const cliente = await Clientes.findByPk(id);
    if (!cliente) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    return res.json(cliente);
  } catch (error) {
    console.error("Error al obtener el cliente:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
});

// Middleware para crear un nuevo cliente
clientesRouter.post("/create", async (req, res) => {
  const { RucDni, Nombre, Direccion, Correo, Activo } = req.body;
  try {
    const nuevoCliente = await Clientes.create({
      RucDni,
      Nombre,
      Direccion,
      Correo,
      Activo
    });
    return res.json(nuevoCliente);
  } catch (error) {
    console.error("Error al crear el cliente:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
});

// Middleware para actualizar un cliente existente
clientesRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { RucDni, Nombre, Direccion, Correo, Activo } = req.body;
  try {
    const cliente = await Clientes.findByPk(id);
    if (!cliente) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    cliente.RucDni = RucDni;
    cliente.Nombre = Nombre;
    cliente.Direccion = Direccion;
    cliente.Correo = Correo;
    cliente.Activo = Activo;
    await cliente.save();
    return res.json(cliente);
  } catch (error) {
    console.error("Error al actualizar el cliente:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
});

// Middleware para eliminar un cliente
clientesRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const cliente = await Clientes.findByPk(id);
    if (!cliente) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    await cliente.destroy();
    return res.json({ mensaje: "Cliente eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el cliente:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
});

function formatDate(date) {
  return new Date(date).toISOString().slice(0, 10);
}

// Exporta el router para usarlo en otros archivos
module.exports = clientesRouter;
