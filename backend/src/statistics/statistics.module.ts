import { BullModule } from '@nestjs/bullmq';
import { Module, OnModuleInit } from '@nestjs/common';

import { STATISTICS_QUEUE } from './statistics.constants';
import { StatisticsProcessor } from './statistics.processor';
import { StatisticsResolver } from './statistics.resolver';
import { StatisticsService } from './statistics.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: STATISTICS_QUEUE,
    }),
  ],
  providers: [StatisticsService, StatisticsProcessor, StatisticsResolver],
  exports: [StatisticsService],
})
export class StatisticsModule implements OnModuleInit {
  constructor(private readonly statisticsService: StatisticsService) {}

  async onModuleInit() {
    await this.statisticsService.scheduleStatisticsComputation();
    await this.statisticsService.computeStatistics();
  }
}
