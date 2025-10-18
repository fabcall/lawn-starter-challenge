import { Query, Resolver } from '@nestjs/graphql';

import { STATISTICS_QUEUE } from './statistics.constants';
import { Statistics } from './statistics.graphql';
import { StatisticsService } from './statistics.service';

@Resolver()
export class StatisticsResolver {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Query(() => Statistics, { name: STATISTICS_QUEUE })
  getStatistics(): Statistics {
    return this.statisticsService.getStatistics();
  }
}
