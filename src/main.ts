import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('AIR QUALITY')
    .setDescription(
      'AIR QUALITY is a mini project that uses the iqair API to fetch air quality data.' +
        '\n @see : https://www.iqair.com/fr/commercial-air-quality-monitors/api',
    )
    .setVersion('1.0')
    .addTag('AIR QUALITY')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_PORT') || 3000;

  await app.listen(port);
}
bootstrap();
