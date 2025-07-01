import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Set global prefix for all routes
  app.setGlobalPrefix('api/v1');
  // Enable CORS
  app.enableCors({
    origin: configService.get<string>('FRONTEND_URL')!,
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(configService.get<number>('BACKEND_PORT')!);
}
void bootstrap();
