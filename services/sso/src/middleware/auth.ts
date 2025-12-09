import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err: any, decoded: any) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    (req as any).user_id = decoded.user_id;
    (req as any).role_name = decoded.role_name;
    (req as any).client_id = decoded.client_id;
    next();
  });
}

export default verifyToken;
