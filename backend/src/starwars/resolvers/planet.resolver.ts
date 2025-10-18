import { Args, Int, Query, Resolver } from "@nestjs/graphql";
import { Planet, PlanetsResponse } from "../starwars.graphql";
import { StarwarsService } from "../starwars.service";
import { StatisticsService } from "src/statistics/statistics.service";

@Resolver(() => Planet)
export class PlanetResolver {
    constructor(
        private readonly starwarsService: StarwarsService,
        private readonly statisticsService: StatisticsService,
    ) { }

    @Query(() => PlanetsResponse, { name: 'planets' })
    async planets(
        @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
        @Args('search', { type: () => String, nullable: true }) search?: string
    ): Promise<PlanetsResponse> {
        const startTime = Date.now();
        const result = await this.starwarsService.getPlanets(page, search);
        const duration = Date.now() - startTime;

        const queryName = search
            ? `planets:search:${search}`
            : `planets:page:${page}`;
        void this.statisticsService.logQuery(queryName, duration).catch(() => { });

        return result;
    }

    @Query(() => Planet, { name: 'planet' })
    async planet(
        @Args('id', { type: () => String }) id: string
    ): Promise<Planet> {
        const startTime = Date.now();
        const result = await this.starwarsService.getPlanet(id);
        const duration = Date.now() - startTime;

        void this.statisticsService
            .logQuery(`planet:${id}`, duration)
            .catch(() => { });

        return result;
    }
}