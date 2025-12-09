import express from 'express';
import productosRouter from './routes/productos';
import ventasRouter from './routes/ventas';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/productos', productosRouter);
app.use('/ventas', ventasRouter);

// Endpoint para verificar estado y conexión a DB
app.get('/health', async (req, res) => {
  try {
    const result = await import('./db').then(m => m.default.query('SELECT NOW()'));
    res.json({ 
      status: 'ok', 
      timestamp: new Date(), 
      db_time: result.rows[0].now 
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', db_error: error.message });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`POS Service running on port ${PORT}`);
});
