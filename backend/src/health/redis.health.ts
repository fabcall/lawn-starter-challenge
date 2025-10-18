import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import {
  HealthIndicatorResult,
  HealthIndicatorService,
} from '@nestjs/terminus';

import { Queue } from 'bullmq';

import { STATISTICS_QUEUE } from '../statistics/statistics.constants';

@Injectable()
export class RedisHealthIndicator extends HealthIndicatorService {
  constructor(@InjectQueue(STATISTICS_QUEUE) private statisticsQueue: Queue) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      await (await this.statisticsQueue.client).ping();

      return this.check(key).up({
        message: 'Redis is up and running',
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      return this.check(key).down({
        message: `Redis is down: ${errorMessage}`,
      });
    }
  }
}
