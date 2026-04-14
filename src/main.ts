import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { printStartupBanner } from './common/utils/startup-banner.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const port = config.get<number>('app.port') ?? 3000;
  const prefix = config.get<string>('app.prefix') ?? 'api/v1';

  app.setGlobalPrefix(prefix);

  // Swagger setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Auth Microservice API')
    .setDescription('Микросервис авторизации и управления пользователями')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT access token',
        in: 'header',
      },
      'bearerAuth',
    )
    .addTag('auth', 'Authentication and authorization')
    .addTag('portal-users', 'Portal user management')
    .addTag('health', 'Health checks')
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  await app.listen(port);
  const url = `http://localhost:${port}/${prefix}`;
  printStartupBanner(config, url);
}
bootstrap();
