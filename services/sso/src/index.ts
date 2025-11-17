import express from 'express';
import authRouter from './routes/auth';
import usuariosRouter from './routes/usuarios';

const app = express();
app.use(express.json());

app.use('/auth', authRouter);
app.use('/usuarios', usuariosRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`SSO Service running on port ${PORT}`);
});
