import { Args, Int, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Character, CharacterResponse, Film } from "../starwars.graphql";
import { StarwarsService } from "../starwars.service";
import { StatisticsService } from "src/statistics/statistics.service";

@Resolver(() => Character)
export class CharacterResolver {
    constructor(
        private readonly starwarsService: StarwarsService,
        private readonly statisticsService: StatisticsService,
    ) { }

    @Query(() => CharacterResponse)
    async characters(
        @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
        @Args('search', { nullable: true }) search?: string,
    ) {
        const startTime = Date.now();
        const result = await this.starwarsService.getCharacters(page, search);
        const duration = Date.now() - startTime;

        const queryName = search
            ? `character:search:${search}`
            : `character:page:${page}`;

        void this.statisticsService
            .logQuery(queryName, duration)
            .catch(() => { });

        return result;
    }

    @Query(() => Character)
    async character(@Args('id') id: string) {
        const startTime = Date.now();
        const result = await this.starwarsService.getCharacter(id);
        const duration = Date.now() - startTime;

        void this.statisticsService
            .logQuery(`character:${id}`, duration)
            .catch(() => { });

        return result;
    }

    @ResolveField(() => [Film])
    async films(@Parent() character: Character) {
        if (character.films?.length > 0) {
            const filmPromises = (character.films as string[]).map(async (filmUrl: string) => {
                const filmId = this.extractIdFromUrl(filmUrl);
                return this.starwarsService.getFilm(filmId);
            });

            return Promise.all(filmPromises);
        }

        return [];
    }

    private extractIdFromUrl(url: string): string {
        const match = url.match(/\/(\d+)\/?$/);
        return match ? match[1] : '';
    }
}