import { Args, Int, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Character, Film, FilmsResponse } from "../starwars.graphql";
import { StarwarsService } from "../starwars.service";
import { StatisticsService } from "src/statistics/statistics.service";

@Resolver(() => Film)
export class FilmResolver {
    constructor(
        private readonly starwarsService: StarwarsService,
        private readonly statisticsService: StatisticsService,
    ) { }

    @Query(() => FilmsResponse, { name: 'films' })
    async getFilms(
        @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
        @Args('search', { type: () => String, nullable: true }) search?: string
    ): Promise<FilmsResponse> {
        const startTime = Date.now();
        const result = await this.starwarsService.getFilms(page, search);
        const duration = Date.now() - startTime;

        const queryName = search ? `films:search:${search}` : `films:page:${page}`;
        void this.statisticsService.logQuery(queryName, duration).catch(() => { });

        return result;
    }

    @Query(() => Film, { name: 'film' })
    async getFilm(
        @Args('id', { type: () => String }) id: string
    ): Promise<Film> {
        const startTime = Date.now();
        const result = await this.starwarsService.getFilm(id);
        const duration = Date.now() - startTime;

        void this.statisticsService.logQuery(`film:${id}`, duration).catch(() => { });

        return result;
    }

    @ResolveField(() => [Character])
    async characters(@Parent() film: Film) {
        if (film.characters?.length > 0) {
            const characterPromises = (film.characters as string[]).map(async (charUrl: string) => {
                const charId = this.extractIdFromUrl(charUrl);
                return this.starwarsService.getCharacter(charId);
            });

            return Promise.all(characterPromises);
        }

        return [];
    }

    private extractIdFromUrl(url: string): string {
        const match = url.match(/\/(\d+)\/?$/);
        return match ? match[1] : '';
    }
}