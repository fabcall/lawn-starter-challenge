/* eslint-disable @typescript-eslint/unbound-method */

import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { Job } from 'bullmq';

import { STATISTICS_JOBS } from './statistics.constants';
import { StatisticsProcessor } from './statistics.processor';
import { StatisticsService } from './statistics.service';

const mockStatisticsService = {
  computeStatistics: jest.fn(),
};

describe('StatisticsProcessor', () => {
  let processor: StatisticsProcessor;
  let service: StatisticsService;

  beforeAll(() => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsProcessor,
        {
          provide: StatisticsService,
          useValue: mockStatisticsService,
        },
      ],
    }).compile();

    processor = module.get<StatisticsProcessor>(StatisticsProcessor);
    service = module.get<StatisticsService>(StatisticsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });

  describe('process', () => {
    it('should call computeStatistics when job name is COMPUTE_STATISTICS', async () => {
      const job: Job = {
        id: '1',
        name: STATISTICS_JOBS.COMPUTE_STATISTICS,
        data: {},
      } as Job;

      mockStatisticsService.computeStatistics.mockResolvedValue(undefined);

      await processor.process(job);

      expect(service.computeStatistics).toHaveBeenCalledTimes(1);
    });

    it('should NOT call computeStatistics for other job names', async () => {
      const job: Job = {
        id: '2',
        name: 'SOME_OTHER_JOB',
        data: {},
      } as Job;

      await processor.process(job);

      expect(service.computeStatistics).not.toHaveBeenCalled();
    });
  });
});
