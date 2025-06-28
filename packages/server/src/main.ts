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
    origin:
      configService.get<string>('FRONTEND_URL') ?? 'http://localhost:5173',
    credentials: true,
  });

  await app.listen(configService.get('BACKEND_PORT') ?? 3000);
}
void bootstrap();
