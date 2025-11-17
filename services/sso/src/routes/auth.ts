import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

const router = Router();
const pool = new Pool();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Faltan datos' });

  try {
    const result = await pool.query('SELECT u.id, u.password, r.name as role_name, u.client_id FROM usuarios u JOIN roles r ON u.role_id = r.id WHERE u.email = $1', [email]);
    if (result.rowCount === 0) return res.status(401).json({ error: 'Usuario no encontrado' });
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign({ user_id: user.id, role_name: user.role_name, client_id: user.client_id }, process.env.JWT_SECRET || 'secret', { expiresIn: '8h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Error interno' });
  }
});

export default router;
