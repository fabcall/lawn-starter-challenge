import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { STATISTICS_QUEUE } from '../statistics/statistics.constants';

import { HealthController } from './health.controller';
import { RedisHealthIndicator } from './redis.health';

@Module({
  imports: [
    TerminusModule,
    HttpModule,
    BullModule.registerQueue({
      name: STATISTICS_QUEUE,
    }),
  ],
  controllers: [HealthController],
  providers: [RedisHealthIndicator],
})
export class HealthModule {}
