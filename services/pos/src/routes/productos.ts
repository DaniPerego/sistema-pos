import { Router } from 'express';
import pool from '../db';

const router = Router();

// GET /productos/search?q=...
router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Falta parámetro de búsqueda q' });

  try {
    const query = `
      SELECT id, nombre, sku, codigo_barras, precio_venta, stock_actual 
      FROM productos 
      WHERE nombre ILIKE $1 OR sku ILIKE $1 OR codigo_barras ILIKE $1
      LIMIT 20
    `;
    const result = await pool.query(query, [`%${q}%`]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al buscar productos' });
  }
});

// GET /productos/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

export default router;
