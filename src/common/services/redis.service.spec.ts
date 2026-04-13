import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';

describe('RedisService', () => {
  let service: RedisService;
  let configService: ConfigService;

  describe('when Redis is enabled', () => {
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          RedisService,
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn().mockReturnValue({
                enabled: true,
                host: 'localhost',
                port: 6379,
                password: undefined,
                db: 0,
                ttl: 300,
              }),
            },
          },
        ],
      }).compile();

      service = module.get<RedisService>(RedisService);
      configService = module.get<ConfigService>(ConfigService);
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should return true for isEnabled()', () => {
      expect(service.isEnabled()).toBe(true);
    });
  });

  describe('when Redis is disabled', () => {
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          RedisService,
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn().mockReturnValue({
                enabled: false,
                host: 'localhost',
                port: 6379,
                password: undefined,
                db: 0,
                ttl: 300,
              }),
            },
          },
        ],
      }).compile();

      service = module.get<RedisService>(RedisService);
      configService = module.get<ConfigService>(ConfigService);
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should return false for isEnabled()', () => {
      expect(service.isEnabled()).toBe(false);
    });

    it('should return null for get() when disabled', async () => {
      const result = await service.get('test-key');
      expect(result).toBeNull();
    });

    it('should return null for set() when disabled', async () => {
      const result = await service.set('test-key', 'test-value');
      expect(result).toBeNull();
    });

    it('should return 0 for del() when disabled', async () => {
      const result = await service.del('test-key');
      expect(result).toBe(0);
    });

    it('should return 0 for exists() when disabled', async () => {
      const result = await service.exists('test-key');
      expect(result).toBe(0);
    });

    it('should return empty object for hgetall() when disabled', async () => {
      const result = await service.hgetall('test-key');
      expect(result).toEqual({});
    });

    it('should return null for getClient() when disabled', () => {
      expect(service.getClient()).toBeNull();
    });
  });
});
