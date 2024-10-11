import { NestFactory } from '@nestjs/core';
import { MyAppModule } from './my-app.module';
import {  ValidationPipe } from '@nestjs/common';
import { SwaggerModule,DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './http.exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(MyAppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,
    forbidNonWhitelisted:true,

  }),);

  const config = new DocumentBuilder()
  .setTitle('nestjs')
  .setDescription(' API description')
  .setVersion('1.0')
  .addTag('cats')
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3300);
}

bootstrap();
