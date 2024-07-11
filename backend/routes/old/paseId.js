const express = require('express');
const router = express.Router();

// Variable para almacenar el ID de la factura
let facturaId = null;

// Endpoint para obtener el ID de la factura
router.get('/id', (req, res) => {
  res.json({ id: facturaId });
});

// Endpoint para actualizar el ID de la factura
router.put('/id', (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'Se requiere un ID válido' });
  }
  facturaId = id;
  res.json({ message: 'ID de factura actualizado correctamente' });
});

module.exports = router;