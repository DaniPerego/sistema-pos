import { Router } from 'express';
import bcrypt from 'bcrypt';
import pool from '../db';
import verifyToken from '../middleware/auth';

const router = Router();

router.post('/', verifyToken, async (req: any, res) => {
  if (req.role_name !== 'ADMIN') return res.status(403).json({ error: 'Solo ADMIN puede crear usuarios' });
  const { email, password, nombre, role_id, client_id } = req.body;
  if (!email || !password || !nombre || !role_id) return res.status(400).json({ error: 'Faltan datos' });

  try {
    const hash = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO usuarios (email, password, nombre, role_id, client_id) VALUES ($1, $2, $3, $4, $5)', [email, hash, nombre, role_id, client_id]);
    res.status(201).json({ message: 'Usuario creado' });
  } catch (err) {
    res.status(500).json({ error: 'Error interno' });
  }
});

export default router;
