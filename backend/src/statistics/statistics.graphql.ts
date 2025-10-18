import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TopQuery {
  @Field()
  query: string;

  @Field(() => Int)
  count: number;

  @Field(() => Float)
  percentage: number;
}

@ObjectType()
export class HourStatistic {
  @Field(() => Int)
  hour: number;

  @Field(() => Int)
  count: number;

  @Field(() => Float)
  percentage: number;
}

@ObjectType()
export class Statistics {
  @Field(() => [TopQuery])
  topQueries: TopQuery[];

  @Field(() => Float)
  averageResponseTime: number;

  @Field(() => Int)
  totalQueries: number;

  @Field(() => Int)
  mostPopularHour: number;

  @Field(() => [HourStatistic])
  hourlyDistribution: HourStatistic[];

  @Field()
  lastUpdated: Date;
}
