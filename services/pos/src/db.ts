import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
  // Vercel Postgres requiere SSL. Habilitarlo si hay connectionString y NO es localhost.
  ssl: (process.env.POSTGRES_URL || process.env.DATABASE_URL)?.includes('localhost') ? undefined : { rejectUnauthorized: false }
});

export default pool;
