import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração do CORS
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Gestão Pro API')
    .setDescription('API para o sistema de gestão de clientes e produtos')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Middlewares
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Inicia o servidor
  await app.listen(3000);
}
bootstrap(); 