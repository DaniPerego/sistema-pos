import request from 'supertest';
import express from 'express';
import authRouter from '../src/routes/auth';

describe('POST /auth/login', () => {
  const app = express();
  app.use(express.json());
  app.use('/auth', authRouter);

  it('debería fallar con credenciales inválidas', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'fake@correo.com', password: '123456' });
    expect([401, 500]).toContain(res.status);
    expect(res.body.error).toBeDefined();
  });
});
