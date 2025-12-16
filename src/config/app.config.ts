import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  environment: process.env.NODE_ENV || 'development',
  

  bodyLimit: process.env.BODY_LIMIT || '10mb', 
  requestTimeout: parseInt(process.env.REQUEST_TIMEOUT || '30000', 10), 
  

  corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['*'],
  

  rateLimit: {
    ttl: parseInt(process.env.RATE_LIMIT_TTL || '60', 10),
    limit: parseInt(process.env.RATE_LIMIT_MAX || '100', 10), 
  },
}));