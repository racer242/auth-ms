import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

function printBanner(config: ConfigService, url: string) {
  const nodeEnv = config.get<string>('app.nodeEnv', 'development');
  const prefix = config.get<string>('app.prefix', 'api/v1');
  const redisEnabled = config.get<string>('redis.enabled', 'false') === 'true';
  const swaggerEnabled = process.env.SWAGGER_ENABLED === 'true';

  console.log('');
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║                                                          ║');
  console.log('║          Auth Microservice — Startup                     ║');
  console.log('║                                                          ║');
  console.log('╠══════════════════════════════════════════════════════════╣');
  console.log(`║  Environment:    ${nodeEnv.padEnd(46)}║`);
  console.log(
    `║  Port:           ${String(config.get('app.port')).padEnd(46)}║`,
  );
  console.log(`║  API Prefix:     ${prefix.padEnd(46)}║`);
  console.log(`║  URL:            ${url.padEnd(46)}║`);
  console.log('╠══════════════════════════════════════════════════════════╣');
  console.log(
    `║  Database:       PostgreSQL (${config.get<string>('database.host')}:${config.get<number>('database.port')}/${config.get<string>('database.name')})${' '.repeat(Math.max(0, 46 - `PostgreSQL (${config.get<string>('database.host')}:${config.get<number>('database.port')}/${config.get<string>('database.name')})`.length))}║`,
  );
  console.log(
    `║  Redis:          ${redisEnabled ? 'Enabled' : 'Disabled'}${' '.repeat(41)}║`,
  );
  console.log(
    `║  Swagger:        ${swaggerEnabled ? 'Enabled' : 'Disabled'}${' '.repeat(41)}║`,
  );
  console.log('║                                                          ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log('');
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const port = config.get<number>('app.port') ?? 3000;
  const prefix = config.get<string>('app.prefix') ?? 'api/v1';

  app.setGlobalPrefix(prefix);

  await app.listen(port);
  const url = `http://localhost:${port}/${prefix}`;
  printBanner(config, url);
}
bootstrap();
