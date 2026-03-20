import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
  });

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('FishBank API')
    .setDescription(
      'API untuk FishBank - Platform Ekosistem Perikanan Indonesia. ' +
      'Mencakup Ensiklopedia Ikan, Marketplace, Chat, dan Admin Panel.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Registrasi & Login')
    .addTag('Users', 'Profil & Wishlist')
    .addTag('Fish Encyclopedia', 'Database Spesies Ikan')
    .addTag('Products', 'Marketplace Listing')
    .addTag('Orders', 'Manajemen Order')
    .addTag('Reviews', 'Rating & Review')
    .addTag('Chat', 'Pesan Buyer-Seller')
    .addTag('Reports', 'Laporan Konten')
    .addTag('Admin', 'Dashboard & Moderasi')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🐠 FishBank API running on http://localhost:${port}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}
bootstrap();
