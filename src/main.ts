import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { FastifyAdapter } from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  new FastifyAdapter({ bodyLimit: 10048576 });
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  if (process.env.__DEV__) {
    const config = new DocumentBuilder()
      .setTitle('Documentation zema')
      .setVersion('1.0')
      .addTag('zema')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(parseInt(process.env.PORT, 10) || 3005);
}
bootstrap();
