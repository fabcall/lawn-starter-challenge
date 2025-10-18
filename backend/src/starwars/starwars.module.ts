import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { StatisticsModule } from '../statistics/statistics.module';

import { StarwarsService } from './starwars.service';
import { CharacterResolver } from './resolvers/character.resolver';
import { FilmResolver } from './resolvers/film.resolver';
import { PlanetResolver } from './resolvers/planet.resolver';
import { StarshipResolver } from './resolvers/starship.resolver';

@Module({
  imports: [HttpModule, StatisticsModule],
  providers: [StarwarsService,
    CharacterResolver,
    FilmResolver,
    PlanetResolver,
    StarshipResolver,
  ],
})
export class StarwarsModule { }
