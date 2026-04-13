import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  name: process.env.DB_NAME || 'auth_service',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'secret',
  poolSize: parseInt(process.env.DB_POOL_SIZE, 10) || 10,
  ssl: process.env.DB_SSL === 'true',
}));
