import { Router } from 'express';
import pool from '../db';

const router = Router();

// POST /ventas
router.post('/', async (req, res) => {
  const ventaData = req.body;
  // ventaData espera: { cajero_id, cliente_id, total, detalles: [{ producto_id, cantidad, precio_unitario }] }
  
  if (!ventaData || !ventaData.detalles || ventaData.detalles.length === 0) {
    return res.status(400).json({ error: 'Datos de venta inválidos' });
  }

  try {
    // Llamada a la función almacenada para transacción atómica
    const query = 'SELECT registrar_venta_atomica($1) as venta_id';
    const result = await pool.query(query, [JSON.stringify(ventaData)]);
    
    res.status(201).json({ 
      message: 'Venta registrada exitosamente', 
      venta_id: result.rows[0].venta_id 
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar venta', details: error.message });
  }
});

export default router;
