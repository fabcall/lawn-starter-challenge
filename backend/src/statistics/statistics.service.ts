import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';

import { Queue } from 'bullmq';
import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';

import { STATISTICS_JOBS, STATISTICS_QUEUE } from './statistics.constants';
import {
  HourStatistic,
  QueryLog,
  Statistics,
  TopQuery,
} from './statistics.types';

const REDIS_LOGS_KEY = 'statistics:logs';

@Injectable()
export class StatisticsService implements OnModuleDestroy {
  private readonly logger = new Logger(StatisticsService.name);
  private currentStatistics: Statistics | null = null;
  private redis: Redis;

  constructor(@InjectQueue(STATISTICS_QUEUE) private statisticsQueue: Queue) {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
    });

    this.redis.on('error', (err) => {
      this.logger.error('Redis error in StatisticsService: ' + err.message);
    });
  }

  onModuleDestroy() {
    try {
      this.redis.quit();
    } catch (err) {
      this.logger.debug(
        'Error while quitting Redis: ' + (err as Error).message
      );
    }
  }

  async logQuery(query: string, duration: number): Promise<void> {
    const timestamp = new Date();
    const queryLog: QueryLog = {
      id: uuidv4(),
      query,
      timestamp,
      duration,
      hour: timestamp.getHours(),
    };

    try {
      await this.redis.rpush(REDIS_LOGS_KEY, JSON.stringify(queryLog));
      this.logger.debug(`Query logged into Redis: ${query} (${duration}ms)`);
    } catch (err) {
      this.logger.error(
        'Failed to write query log to Redis: ' + (err as Error).message
      );
    }
  }

  async scheduleStatisticsComputation(): Promise<void> {
    await this.statisticsQueue.add(
      STATISTICS_JOBS.COMPUTE_STATISTICS,
      {},
      {
        repeat: {
          every: 5 * 60 * 1000,
        },
      }
    );
    this.logger.log('Statistics computation scheduled every 5 minutes');
  }

  async computeStatistics(): Promise<Statistics> {
    this.logger.log('Computing statistics (reading from Redis)...');

    let rawLogs: string[] = [];
    try {
      rawLogs = await this.redis.lrange(REDIS_LOGS_KEY, 0, -1);
    } catch (err) {
      this.logger.error(
        'Failed to read logs from Redis: ' + (err as Error).message
      );
      if (this.currentStatistics) return this.currentStatistics;
      const emptyStats: Statistics = {
        topQueries: [],
        averageResponseTime: 0,
        totalQueries: 0,
        mostPopularHour: 0,
        hourlyDistribution: [],
        lastUpdated: new Date(),
      };
      this.currentStatistics = emptyStats;
      return emptyStats;
    }

    if (!rawLogs || rawLogs.length === 0) {
      const emptyStats: Statistics = {
        topQueries: [],
        averageResponseTime: 0,
        totalQueries: 0,
        mostPopularHour: 0,
        hourlyDistribution: [],
        lastUpdated: new Date(),
      };
      this.currentStatistics = emptyStats;
      return emptyStats;
    }

    const logs: QueryLog[] = rawLogs
      .map((s) => {
        try {
          return JSON.parse(s) as QueryLog;
        } catch {
          return null;
        }
      })
      .filter(Boolean) as QueryLog[];

    const totalQueries = logs.length;
    const totalDuration = logs.reduce((acc, l) => acc + (l.duration || 0), 0);
    const averageResponseTime =
      totalQueries > 0 ? Math.round(totalDuration / totalQueries) : 0;

    const queryCounts = new Map<string, number>();
    logs.forEach((l) => {
      const q = l.query;
      queryCounts.set(q, (queryCounts.get(q) || 0) + 1);
    });

    const topQueries: TopQuery[] = Array.from(queryCounts.entries())
      .map(([query, count]) => {
        const percentage = totalQueries > 0 ? (count / totalQueries) * 100 : 0;
        return {
          query,
          count,
          percentage: Math.round(percentage * 100) / 100,
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const hourCounts = new Array(24).fill(0) as Array<number>;
    logs.forEach((l) => {
      const h =
        typeof l.hour === 'number' ? l.hour : new Date(l.timestamp).getHours();
      if (h >= 0 && h < 24) hourCounts[h] += 1;
    });

    const hourlyDistribution: HourStatistic[] = hourCounts.map(
      (count, hour) => {
        const percentage = totalQueries > 0 ? (count / totalQueries) * 100 : 0;
        return {
          hour,
          count,
          percentage: Math.round(percentage * 100) / 100,
        };
      }
    );

    let mostPopularHour = 0;
    let maxCount = -1;
    hourlyDistribution.forEach((h) => {
      if (h.count > maxCount) {
        maxCount = h.count;
        mostPopularHour = h.hour;
      }
    });

    const statistics: Statistics = {
      topQueries,
      averageResponseTime,
      totalQueries,
      mostPopularHour,
      hourlyDistribution,
      lastUpdated: new Date(),
    };

    this.currentStatistics = statistics;

    try {
      await this.redis.del(REDIS_LOGS_KEY);
      this.logger.log(`Processed ${totalQueries} logs and cleared Redis list`);
    } catch (err) {
      this.logger.error(
        'Failed to clear logs from Redis: ' + (err as Error).message
      );
    }

    return statistics;
  }

  getStatistics(): Statistics {
    if (!this.currentStatistics) {
      return {
        topQueries: [],
        averageResponseTime: 0,
        totalQueries: 0,
        mostPopularHour: 0,
        hourlyDistribution: [],
        lastUpdated: new Date(),
      };
    }
    return this.currentStatistics;
  }

  clearLogs(): void {
    this.redis
      .del(REDIS_LOGS_KEY)
      .catch((err) =>
        this.logger.error(
          'Failed to clear Redis logs: ' + (err as Error).message
        )
      );
    this.currentStatistics = null;
    this.logger.log('Query logs cleared');
  }
}
