import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { DynamicStatusInterceptor } from './common/interceptors/dynamic-status.interceptor';
import * as compression from 'compression';
import helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.use(helmet({
    contentSecurityPolicy: false, 
  }));


  app.use(compression());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      disableErrorMessages: process.env.NODE_ENV === 'production',
    }),
  );

  const reflector = app.get(Reflector);

  app.useGlobalInterceptors(
    new DynamicStatusInterceptor(reflector),
    new ResponseInterceptor()
  );
  
  app.useGlobalFilters(new GlobalExceptionFilter());
  

  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || '*',
    credentials: true,
  });
  
  app.setGlobalPrefix('api/v1');


  const config = new DocumentBuilder()
    .setTitle('API APM')
    .setDescription('Documentación de la API de CHECK - Sistema de entradas y salidas de personal ')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { 
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') || 3000;
  const environment = configService.get<string>('app.environment') || 'development';
  const database = configService.get<string>('database.database') || 'N/A';
  const dbPool = configService.get<number>('database.extra.max') || 20;


  await app.listen(port, '0.0.0.0');


  const signals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT', 'SIGUSR2'];
  signals.forEach(signal => {
    process.on(signal, async () => {
      logger.warn(`⚠️  Received ${signal}, closing server gracefully...`);
      

      await app.close();
      
      logger.log('Server closed gracefully');
      process.exit(0);
    });
  });


  process.on('uncaughtException', (error) => {
    logger.error('🔴 Uncaught Exception:', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('🔴 Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
  });

  const memUsage = Math.round(process.memoryUsage().rss / 1024 / 1024);

  logger.log(`
    ╔═══════════════════════════════════════════╗
    ║   🚀 API APM v3 Running                   ║
    ╠═══════════════════════════════════════════╣
    ║  🌐 API: http://localhost:${port}/api/v3   ║
    ║  📘 Docs: http://localhost:${port}/api/docs║
    ║  🏢 Environment: ${environment.padEnd(24)} ║
    ║  🗄️  Database: ${database.padEnd(26)}.     ║
    ║  🔌 DB Pool: ${dbPool} connections         ║
    ║  💾 Memory: ${memUsage}MB                  ║
    ║  🐳 Container: Ready                       ║
    ║  ⚡ High throughput mode: ON               ║
    ╚═══════════════════════════════════════════╝ 
  `);

}

bootstrap();