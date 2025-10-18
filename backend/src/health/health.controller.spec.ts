/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/unbound-method */

import { ConfigService } from '@nestjs/config';
import {
  HealthCheckResult,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';

import { HealthController } from './health.controller';
import { RedisHealthIndicator } from './redis.health';

describe('HealthController', () => {
  let controller: HealthController;
  let health: HealthCheckService;
  let http: HttpHealthIndicator;
  let redis: RedisHealthIndicator;
  let configService: ConfigService;

  const mockHealthCheckService = {
    check: jest.fn(),
  };

  const mockHttpHealthIndicator = {
    pingCheck: jest.fn(),
  };

  const mockRedisHealthIndicator = {
    isHealthy: jest.fn(),
  };

  const mockConfigService = {
    getOrThrow: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: HealthCheckService, useValue: mockHealthCheckService },
        { provide: HttpHealthIndicator, useValue: mockHttpHealthIndicator },
        { provide: RedisHealthIndicator, useValue: mockRedisHealthIndicator },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    health = module.get<HealthCheckService>(HealthCheckService);
    http = module.get<HttpHealthIndicator>(HttpHealthIndicator);
    redis = module.get<RedisHealthIndicator>(RedisHealthIndicator);
    configService = module.get<ConfigService>(ConfigService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('check', () => {
    it('should call all health indicators and return a success status', async () => {
      const swapiBaseUrl = 'https://swapi.dev/api';
      const expectedResult: HealthCheckResult = {
        status: 'ok',
        info: {
          api: { status: 'up' },
          swapi: { status: 'up' },
          redis: { status: 'up' },
        },
        details: {},
      };

      mockConfigService.getOrThrow.mockReturnValue(swapiBaseUrl);
      mockHealthCheckService.check.mockResolvedValue(expectedResult);
      mockHttpHealthIndicator.pingCheck.mockResolvedValue({
        api: { status: 'up' },
      });
      mockRedisHealthIndicator.isHealthy.mockResolvedValue({
        redis: { status: 'up' },
      });

      const result = await controller.check();

      expect(result).toEqual(expectedResult);
      expect(health.check).toHaveBeenCalledTimes(1);

      const healthCheckFunctions = (health.check as jest.Mock).mock
        .calls[0][0] as Array<() => unknown>;

      expect(healthCheckFunctions).toHaveLength(3);

      await healthCheckFunctions[0]();
      expect(http.pingCheck).toHaveBeenCalledWith(
        'api',
        'http://localhost:3000'
      );

      await healthCheckFunctions[1]();
      expect(configService.getOrThrow).toHaveBeenCalledWith('swapi.baseUrl', {
        infer: true,
      });
      expect(http.pingCheck).toHaveBeenCalledWith('swapi', swapiBaseUrl);

      await healthCheckFunctions[2]();
      expect(redis.isHealthy).toHaveBeenCalledWith('redis');
    });
  });
});
