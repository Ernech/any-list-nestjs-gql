import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
    whitelist: true,
    //forbidNonWhitelisted: true,
    })
  );
  const PORT = process.env.POST || 3000
  await app.listen(PORT);
  console.log(`App runing on port ${PORT}`);
}
bootstrap();
