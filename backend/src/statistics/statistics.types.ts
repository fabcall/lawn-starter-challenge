export interface QueryLog {
  id: string;
  query: string;
  timestamp: Date;
  duration: number;
  hour: number;
}

export interface TopQuery {
  query: string;
  count: number;
  percentage: number;
}

export interface HourStatistic {
  hour: number;
  count: number;
  percentage: number;
}

export interface Statistics {
  topQueries: TopQuery[];
  averageResponseTime: number;
  totalQueries: number;
  mostPopularHour: number;
  hourlyDistribution: HourStatistic[];
  lastUpdated: Date;
}
