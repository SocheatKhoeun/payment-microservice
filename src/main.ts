// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(process.env.PORT ?? 3000);
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Add a global prefix for all routes
  app.setGlobalPrefix('api');

  // Enable CORS
  app.enableCors({
    origin: process.env.ALLOW_CORS || 'http://localhost:5000',
  });

  const config = new DocumentBuilder()
    .setTitle('RokTenh POS API')
    .setDescription('API documentation for RokTenh POS')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);


  await app.listen(process.env.PORT || 3000);
  console.log('\n----------------------------------------------');
  console.log(`Application is running on port: ${process.env.PORT || 3000}`);
  console.log(`Local Time: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Phnom_Penh' })}`);
  console.log('----------------------------------------------');

}
bootstrap();
