import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'database',
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  dropSchema: process.env.NODE_ENV === 'development' && process.env.DROP_SCHEMA === 'true', 
  logging: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : false,
  entities: [__dirname + '/../**/*.model{.ts,.js}'], 
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  migrationsRun: false,
  

  extra: {
    max: parseInt(process.env.DB_POOL_MAX || '50', 10), 
    min: parseInt(process.env.DB_POOL_MIN || '10', 10), 
    idleTimeoutMillis: 30000, 
    connectionTimeoutMillis: 5000, 
    statement_timeout: 30000, 
    query_timeout: 30000,
  },
  

  poolSize: parseInt(process.env.DB_POOL_SIZE || '50', 10),
  

  cache: {
    duration: 30000, 
    type: 'database',
  },
}));