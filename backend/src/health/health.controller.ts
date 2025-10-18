import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';

import { AllConfigType } from '../config/config.type';

import { RedisHealthIndicator } from './redis.health';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private redis: RedisHealthIndicator,
    private configService: ConfigService<AllConfigType>
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck('api', 'http://localhost:3000'),

      () =>
        this.http.pingCheck(
          'swapi',
          this.configService.getOrThrow('swapi.baseUrl', { infer: true })
        ),

      () => this.redis.isHealthy('redis'),
    ]);
  }
}
