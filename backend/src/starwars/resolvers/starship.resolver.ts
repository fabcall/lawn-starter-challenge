import { Args, Int, Query, Resolver } from "@nestjs/graphql";
import { Planet, Starship, StarshipsResponse } from "../starwars.graphql";
import { StarwarsService } from "../starwars.service";
import { StatisticsService } from "src/statistics/statistics.service";

@Resolver(() => Starship)
export class StarshipResolver {
    constructor(
        private readonly starwarsService: StarwarsService,
        private readonly statisticsService: StatisticsService,
    ) { }

    @Query(() => StarshipsResponse, { name: 'starships' })
    async starships(
        @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
        @Args('search', { type: () => String, nullable: true }) search?: string
    ): Promise<StarshipsResponse> {
        const startTime = Date.now();
        const result = await this.starwarsService.getStarships(page, search);
        const duration = Date.now() - startTime;

        const queryName = search
            ? `starships:search:${search}`
            : `starships:page:${page}`;
        void this.statisticsService.logQuery(queryName, duration).catch(() => { });

        return result;
    }

    @Query(() => Starship, { name: 'starship' })
    async starship(
        @Args('id', { type: () => String }) id: string
    ): Promise<Starship> {
        const startTime = Date.now();
        const result = await this.starwarsService.getStarship(id);
        const duration = Date.now() - startTime;

        void this.statisticsService
            .logQuery(`starship:${id}`, duration)
            .catch(() => { });

        return result;
    }
}

