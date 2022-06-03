import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { LoggingInterceptor } from './config/interceptors/logging.interceptor';

const PORT = process.env.PORT || 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['warn', 'debug', 'log', 'error', 'verbose']
  });
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true
  })
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser())
  await app.listen(PORT);
}
bootstrap();
