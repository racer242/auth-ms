import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis | null = null;
  private readonly logger = new Logger(RedisService.name);
  private readonly enabled: boolean;

  constructor(private configService: ConfigService) {
    const redisConfig = this.configService.get('redis');
    this.enabled = redisConfig?.enabled ?? true;
  }

  async onModuleInit() {
    if (!this.enabled) {
      this.logger.warn(
        'Redis is disabled. Caching functionality will not be available.',
      );
      return;
    }

    const config = this.configService.get('redis');
    this.client = new Redis({
      host: config.host,
      port: config.port,
      password: config.password,
      db: config.db,
    });

    this.client.on('error', (error) => {
      this.logger.error('Redis error:', error.message);
    });

    this.client.on('connect', () => {
      this.logger.log('Redis connected');
    });
  }

  onModuleDestroy() {
    this.client?.disconnect();
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  getClient(): Redis | null {
    return this.client;
  }

  // Helper methods
  async get(key: string): Promise<string | null> {
    if (!this.enabled || !this.client) return null;
    return this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<'OK' | null> {
    if (!this.enabled || !this.client) return null;
    if (ttl) {
      return this.client.set(key, value, 'EX', ttl);
    }
    return this.client.set(key, value);
  }

  async del(key: string): Promise<number> {
    if (!this.enabled || !this.client) return 0;
    return this.client.del(key);
  }

  async exists(key: string): Promise<number> {
    if (!this.enabled || !this.client) return 0;
    return this.client.exists(key);
  }

  async expire(key: string, ttl: number): Promise<number> {
    if (!this.enabled || !this.client) return 0;
    return this.client.expire(key, ttl);
  }

  async hset(key: string, field: string, value: string): Promise<number> {
    if (!this.enabled || !this.client) return 0;
    return this.client.hset(key, field, value);
  }

  async hget(key: string, field: string): Promise<string | null> {
    if (!this.enabled || !this.client) return null;
    return this.client.hget(key, field);
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    if (!this.enabled || !this.client) return {};
    return this.client.hgetall(key);
  }

  async hdel(key: string, field: string): Promise<number> {
    if (!this.enabled || !this.client) return 0;
    return this.client.hdel(key, field);
  }

  async incr(key: string): Promise<number> {
    if (!this.enabled || !this.client) return 0;
    return this.client.incr(key);
  }

  async pexpire(key: string, ttl: number): Promise<number> {
    if (!this.enabled || !this.client) return 0;
    return this.client.pexpire(key, ttl);
  }
}
