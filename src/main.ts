import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { printStartupBanner } from './common/utils/startup-banner.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const port = config.get<number>('app.port') ?? 3000;
  const prefix = config.get<string>('app.prefix') ?? 'api/v1';

  app.setGlobalPrefix(prefix);

  await app.listen(port);
  const url = `http://localhost:${port}/${prefix}`;
  printStartupBanner(config, url);
}
bootstrap();
