/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/unbound-method */

import { getQueueToken } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { v4 as uuidv4 } from 'uuid';

import { STATISTICS_JOBS, STATISTICS_QUEUE } from './statistics.constants';
import { StatisticsService } from './statistics.service';
import { QueryLog } from './statistics.types';

const mockRedisInstance = {
  rpush: jest.fn(),
  lrange: jest.fn(),
  del: jest.fn(),
  quit: jest.fn(),
  on: jest.fn(),
};

jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => mockRedisInstance);
});

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

const mockStatisticsQueue = {
  add: jest.fn(),
};

describe('StatisticsService', () => {
  let service: StatisticsService;

  beforeAll(() => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'debug').mockImplementation(() => {});
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsService,
        {
          provide: getQueueToken(STATISTICS_QUEUE),
          useValue: mockStatisticsQueue,
        },
      ],
    }).compile();

    service = module.get<StatisticsService>(StatisticsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logQuery', () => {
    it('should log a query to Redis', async () => {
      const query = 'people:page:1';
      const duration = 150;
      const mockUuid = 'mock-uuid-123';
      (uuidv4 as jest.Mock).mockReturnValue(mockUuid);

      await service.logQuery(query, duration);

      expect(mockRedisInstance.rpush).toHaveBeenCalledTimes(1);
      const [key, value] = mockRedisInstance.rpush.mock.calls[0];
      expect(key).toBe('statistics:logs');

      const loggedData = JSON.parse(value);
      expect(loggedData).toMatchObject({
        id: mockUuid,
        query,
        duration,
        hour: expect.any(Number),
      });
    });

    it('should log an error if Redis fails', async () => {
      mockRedisInstance.rpush.mockRejectedValue(
        new Error('Redis connection failed')
      );

      await service.logQuery('test', 100);

      expect(Logger.prototype.error).toHaveBeenCalledWith(
        'Failed to write query log to Redis: Redis connection failed'
      );
    });
  });

  describe('scheduleStatisticsComputation', () => {
    it('should add a repeatable job to the queue', async () => {
      await service.scheduleStatisticsComputation();

      expect(mockStatisticsQueue.add).toHaveBeenCalledWith(
        STATISTICS_JOBS.COMPUTE_STATISTICS,
        {},
        {
          repeat: {
            every: 5 * 60 * 1000,
          },
        }
      );
    });
  });

  describe('computeStatistics', () => {
    it('should compute statistics correctly from logs', async () => {
      const logs: QueryLog[] = [
        {
          id: '1',
          query: 'people:1',
          duration: 100,
          timestamp: new Date('2025-10-17T14:10:00Z'),
          hour: 14,
        },
        {
          id: '2',
          query: 'people:1',
          duration: 120,
          timestamp: new Date('2025-10-17T14:20:00Z'),
          hour: 14,
        },
        {
          id: '3',
          query: 'planets:5',
          duration: 200,
          timestamp: new Date('2025-10-17T15:05:00Z'),
          hour: 15,
        },
        {
          id: '4',
          query: 'people:2',
          duration: 80,
          timestamp: new Date('2025-10-17T14:30:00Z'),
          hour: 14,
        },
      ];
      const rawLogs = logs.map((log) => JSON.stringify(log));
      mockRedisInstance.lrange.mockResolvedValue(rawLogs);
      mockRedisInstance.del.mockResolvedValue(1);

      const stats = await service.computeStatistics();

      expect(mockRedisInstance.lrange).toHaveBeenCalledWith(
        'statistics:logs',
        0,
        -1
      );
      expect(stats.totalQueries).toBe(4);
      expect(stats.averageResponseTime).toBe(
        Math.round((100 + 120 + 200 + 80) / 4)
      ); // 125
      expect(stats.mostPopularHour).toBe(14);
      expect(stats.topQueries).toEqual([
        { query: 'people:1', count: 2, percentage: 50 },
        { query: 'planets:5', count: 1, percentage: 25 },
        { query: 'people:2', count: 1, percentage: 25 },
      ]);
      expect(stats.hourlyDistribution[14].count).toBe(3);
      expect(stats.hourlyDistribution[15].count).toBe(1);
      expect(mockRedisInstance.del).toHaveBeenCalledWith('statistics:logs');
    });

    it('should return empty stats if no logs are found', async () => {
      mockRedisInstance.lrange.mockResolvedValue([]);

      const stats = await service.computeStatistics();

      expect(stats.totalQueries).toBe(0);
      expect(stats.averageResponseTime).toBe(0);
      expect(stats.topQueries).toEqual([]);
    });

    it('should return empty stats on Redis read failure', async () => {
      mockRedisInstance.lrange.mockRejectedValue(new Error('Read failed'));

      const stats = await service.computeStatistics();

      expect(Logger.prototype.error).toHaveBeenCalledWith(
        'Failed to read logs from Redis: Read failed'
      );
      expect(stats.totalQueries).toBe(0);
      expect(mockRedisInstance.del).not.toHaveBeenCalled();
    });
  });

  describe('getStatistics', () => {
    it('should return null stats if not computed yet', () => {
      const stats = service.getStatistics();

      expect(stats.totalQueries).toBe(0);
    });

    it('should return computed stats', async () => {
      const logs = [
        {
          id: '1',
          query: 'people:1',
          duration: 100,
          timestamp: new Date(),
          hour: 10,
        },
      ];
      mockRedisInstance.lrange.mockResolvedValue(
        logs.map((log) => JSON.stringify(log))
      );
      await service.computeStatistics();

      const stats = service.getStatistics();

      expect(stats.totalQueries).toBe(1);
      expect(stats.averageResponseTime).toBe(100);
    });
  });

  describe('clearLogs', () => {
    it('should call redis.del and clear currentStatistics', async () => {
      const logs = [
        {
          id: '1',
          query: 'people:1',
          duration: 100,
          timestamp: new Date(),
          hour: 10,
        },
      ];
      mockRedisInstance.lrange.mockResolvedValue(
        logs.map((log) => JSON.stringify(log))
      );
      await service.computeStatistics();
      expect(service.getStatistics().totalQueries).toBe(1);

      service.clearLogs();

      expect(mockRedisInstance.del).toHaveBeenCalledWith('statistics:logs');
      expect(service.getStatistics().totalQueries).toBe(0);
    });
  });

  describe('onModuleDestroy', () => {
    it('should call redis.quit', () => {
      service.onModuleDestroy();

      expect(mockRedisInstance.quit).toHaveBeenCalledTimes(1);
    });
  });
});
