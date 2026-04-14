import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

const W = 60;

function row(label: string, value: string) {
  return `║  ${`${label}  ${value}`.padEnd(W - 2)}║`;
}

function divider() {
  return `╠${'═'.repeat(W)}╣`;
}

function emptyRow() {
  return `║${' '.repeat(W)}║`;
}

function printBanner(config: ConfigService, url: string) {
  const nodeEnv = config.get<string>('app.nodeEnv', 'development');
  const port = config.get<number>('app.port', 3000);
  const prefix = config.get<string>('app.prefix', 'api/v1');
  const redisEnabled = config.get<boolean>('redis.enabled', false);
  const swaggerEnabled = process.env.SWAGGER_ENABLED === 'true';

  const dbHost = config.get<string>('database.host', 'localhost');
  const dbPort = config.get<number>('database.port', 5432);
  const dbName = config.get<string>('database.name', 'auth_service');

  const throttleLimit = process.env.THROTTLE_LIMIT ?? '100';
  const throttleTtl = process.env.THROTTLE_TTL ?? '60000';
  const authThrottleLimit = process.env.AUTH_THROTTLE_LOGIN_LIMIT ?? '5';
  const authThrottleTtl = process.env.AUTH_THROTTLE_LOGIN_TTL ?? '60000';

  console.log('');
  console.log(`╔${'═'.repeat(W)}╗`);
  const title = 'Auth Microservice — Startup';
  console.log(
    `║${title.padStart(Math.floor((W + title.length) / 2)).padEnd(W)}║`,
  );
  console.log(divider());

  // App
  console.log(emptyRow());
  console.log(row('App', ''));
  console.log(row('Environment', nodeEnv));
  console.log(row('Port', String(port)));
  console.log(row('API Prefix', prefix));
  console.log(row('URL', url));
  console.log(emptyRow());
  console.log(divider());

  // Database
  console.log(emptyRow());
  console.log(row('Database', ''));
  console.log(row('Host', `${dbHost}:${dbPort}`));
  console.log(row('Name', dbName));
  console.log(emptyRow());
  console.log(divider());

  // Redis
  console.log(emptyRow());
  console.log(row('Redis', ''));
  console.log(row('Status', redisEnabled ? 'Enabled' : 'Disabled'));
  if (redisEnabled) {
    console.log(
      row(
        'Host',
        `${config.get<string>('redis.host')}:${config.get<number>('redis.port')}`,
      ),
    );
    console.log(row('DB', String(config.get<number>('redis.db'))));
    console.log(row('TTL', `${config.get<number>('redis.ttl')}s`));
  }
  console.log(emptyRow());
  console.log(divider());

  // JWT
  console.log(emptyRow());
  console.log(row('JWT', ''));
  console.log(row('Access TTL', `${config.get<number>('jwt.accessExpiry')}s`));
  console.log(
    row('Refresh TTL', `${config.get<number>('jwt.refreshExpiry')}s`),
  );
  console.log(
    row('Remember TTL', `${config.get<number>('jwt.refreshExpiryRemember')}s`),
  );
  console.log(emptyRow());
  console.log(divider());

  // Rate Limit
  console.log(emptyRow());
  console.log(row('Rate Limit', ''));
  console.log(row('General', `${throttleLimit} req / ${throttleTtl}ms`));
  console.log(
    row('Auth Login', `${authThrottleLimit} req / ${authThrottleTtl}ms`),
  );
  console.log(emptyRow());
  console.log(divider());

  // Swagger
  console.log(emptyRow());
  console.log(row('Swagger', ''));
  console.log(row('Status', swaggerEnabled ? 'Enabled' : 'Disabled'));
  console.log(emptyRow());

  console.log(`╚${'═'.repeat(W)}╝`);
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
