/* eslint-disable @typescript-eslint/unbound-method */

import { Test, TestingModule } from '@nestjs/testing';

import { Statistics } from './statistics.graphql';
import { StatisticsResolver } from './statistics.resolver';
import { StatisticsService } from './statistics.service';

const mockStatisticsService = {
  getStatistics: jest.fn(),
};

describe('StatisticsResolver', () => {
  let resolver: StatisticsResolver;
  let service: StatisticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsResolver,
        {
          provide: StatisticsService,
          useValue: mockStatisticsService,
        },
      ],
    }).compile();

    resolver = module.get<StatisticsResolver>(StatisticsResolver);
    service = module.get<StatisticsService>(StatisticsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getStatistics', () => {
    it('should call the service and return its result', () => {
      const mockResult: Statistics = {
        totalQueries: 100,
        averageResponseTime: 150,
        mostPopularHour: 14,
        topQueries: [],
        hourlyDistribution: [],
        lastUpdated: new Date(),
      };
      mockStatisticsService.getStatistics.mockReturnValue(mockResult);

      const result = resolver.getStatistics();

      expect(service.getStatistics).toHaveBeenCalledTimes(1);

      expect(result).toEqual(mockResult);
    });
  });
});
