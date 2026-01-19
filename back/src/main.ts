import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { loggingMiddleware } from './common/middleware/logging.middleware';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend (development)
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  const logger = new Logger('Bootstrap');

  // HTTP request logging
  app.use(loggingMiddleware);

  // Global exception logging + formatted response
  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      //whitelist: true, // Nettoie les champs non déclarés
      transform: true, // Convertit les types automatiquement
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  logger.log(`Application lancée: ${await app.getUrl()}`);
}

bootstrap();
