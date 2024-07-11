const { Router } = require('express');
const { Sequelize, DataTypes } = require('sequelize');

// Crea un nuevo router
const loginRouter = Router();

// Configuración de la conexión a la base de datos
const sequelize = new Sequelize('facturacion', 'root', '21042001', {
  host: 'localhost',
  dialect: 'mysql'
});

// Definir el modelo de Usuario
const Usuario = sequelize.define('Usuario', {
    idUsuario: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
    usuario: {
      type: DataTypes.STRING,
      allowNull: false
    },
    contrasena: {
      type: DataTypes.STRING,
      allowNull: false
    },
    intentosFallidos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    bloqueado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    }, {
      timestamps: false // Desactiva el seguimiento de createdAt y updatedAt
    });
  
  // Endpoint para la autenticación del usuario
  loginRouter.post("/", async (req, res) => {
    const { usuario, contrasena } = req.body;
  
    try {
      // Buscar al usuario en la base de datos
      const usuarioEncontrado = await Usuario.findOne({
        where: { usuario }
      });
  
      if (!usuarioEncontrado) {
        // Usuario no encontrado
        return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
      }
      
      // Verificar si la contraseña es correcta
      if (usuarioEncontrado.contrasena !== contrasena) {
        // Contraseña incorrecta, aumentar el contador de intentos fallidos
        await usuarioEncontrado.increment('intentosFallidos');
        
        if (usuarioEncontrado.intentosFallidos >= 3) {
          // Si hay 3 o más intentos fallidos, bloquear al usuario
          await usuarioEncontrado.update({ bloqueado: true });
        }
        
        return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
      }
      
      // Verificar si el usuario está bloqueado
      if (usuarioEncontrado.bloqueado) {
        return res.status(402).json({ error: "Su cuenta está bloqueada. Por favor, comuníquese con el administrador." });
      }
  
      // Usuario autenticado correctamente
      return res.json({ mensaje: "Inicio de sesión exitoso" });
    } catch (error) {
      console.error("Error en el servidor:", error);
      return res.status(500).json({ error: "Error en el servidor" });
    }
});

module.exports = loginRouter;

