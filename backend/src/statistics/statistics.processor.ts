import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';

import { Job } from 'bullmq';

import { STATISTICS_JOBS, STATISTICS_QUEUE } from './statistics.constants';
import { StatisticsService } from './statistics.service';

@Processor(STATISTICS_QUEUE)
export class StatisticsProcessor extends WorkerHost {
  private readonly logger = new Logger(StatisticsProcessor.name);

  constructor(private readonly statisticsService: StatisticsService) {
    super();
  }

  async process(job: Job): Promise<void> {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);

    if (job.name === STATISTICS_JOBS.COMPUTE_STATISTICS) {
      await this.statisticsService.computeStatistics();
      this.logger.log('Statistics computation completed');
    }
  }
}
