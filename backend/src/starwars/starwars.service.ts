import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AllConfigType } from 'src/config/config.type';

import {
  Character,
  CharacterResponse,
  Film,
  FilmsResponse,
  Planet,
  PlanetsResponse,
  Starship,
  StarshipsResponse,
  SwapiPaginatedResponse,
  SwApiFilm,
  SwApiCharacter,
  SwApiPlanet,
  SwApiStarship,
} from './starwars.types';

@Injectable()
export class StarwarsService {
  private readonly baseUrl: string;
  private readonly timeout: number;

  constructor(
    private configService: ConfigService<AllConfigType>,
    private readonly httpService: HttpService
  ) {
    this.baseUrl = this.configService.getOrThrow('swapi.baseUrl', {
      infer: true,
    });
    this.timeout = this.configService.getOrThrow('swapi.timeout', {
      infer: true,
    });
  }

  private async fetchFromSwapi<T>(endpoint: string): Promise<T> {
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get<T>(`${this.baseUrl}${endpoint}`, {
            timeout: this.timeout,
          })
          .pipe(
            catchError((error: AxiosError) => {
              if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
                throw new HttpException(
                  'Request timeout to SWAPI',
                  HttpStatus.REQUEST_TIMEOUT
                );
              }

              if (error.response) {
                throw new HttpException(
                  'Failed to fetch from SWAPI',
                  HttpStatus.BAD_GATEWAY
                );
              }

              throw new HttpException(
                'Error connecting to SWAPI',
                HttpStatus.INTERNAL_SERVER_ERROR
              );
            })
          )
      );

      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error connecting to SWAPI',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private extractIdFromUrl(url: string): string {
    const match = url.match(/\/(\d+)\/$/);
    return match ? match[1] : '';
  }

  async getCharacters(
    page: number = 1,
    search?: string
  ): Promise<CharacterResponse> {
    let endpoint = `/people/?page=${page}`;
    if (search) {
      endpoint += `&search=${encodeURIComponent(search)}`;
    }

    const data =
      await this.fetchFromSwapi<SwapiPaginatedResponse<SwApiCharacter>>(endpoint);

    const results: Character[] = data.results.map((character) => ({
      ...character,
      id: this.extractIdFromUrl(character.url),
    }));

    return {
      ...data,
      results,
    };
  }

  async getCharacter(id: string): Promise<Character> {
    const data = await this.fetchFromSwapi<SwApiCharacter>(`/people/${id}/`);
    return {
      ...data,
      id: this.extractIdFromUrl(data.url),
    };
  }

  async getPlanets(
    page: number = 1,
    search?: string
  ): Promise<PlanetsResponse> {
    let endpoint = `/planets/?page=${page}`;
    if (search) {
      endpoint += `&search=${encodeURIComponent(search)}`;
    }

    const data =
      await this.fetchFromSwapi<SwapiPaginatedResponse<SwApiPlanet>>(endpoint);

    const results: Planet[] = data.results.map((planet) => ({
      ...planet,
      id: this.extractIdFromUrl(planet.url),
    }));

    return {
      ...data,
      results,
    };
  }

  async getPlanet(id: string): Promise<Planet> {
    const data = await this.fetchFromSwapi<SwApiPlanet>(`/planets/${id}/`);
    return {
      ...data,
      id: this.extractIdFromUrl(data.url),
    };
  }

  async getStarships(
    page: number = 1,
    search?: string
  ): Promise<StarshipsResponse> {
    let endpoint = `/starships/?page=${page}`;
    if (search) {
      endpoint += `&search=${encodeURIComponent(search)}`;
    }

    const data =
      await this.fetchFromSwapi<SwapiPaginatedResponse<SwApiStarship>>(
        endpoint
      );

    const results: Starship[] = data.results.map((starship) => ({
      ...starship,
      id: this.extractIdFromUrl(starship.url),
    }));

    return {
      ...data,
      results,
    };
  }

  async getStarship(id: string): Promise<Starship> {
    const data = await this.fetchFromSwapi<SwApiStarship>(`/starships/${id}/`);
    return {
      ...data,
      id: this.extractIdFromUrl(data.url),
    };
  }

  async getFilms(page: number = 1, search?: string): Promise<FilmsResponse> {
    let endpoint = `/films/?page=${page}`;
    if (search) {
      endpoint += `&search=${encodeURIComponent(search)}`;
    }

    const data =
      await this.fetchFromSwapi<SwapiPaginatedResponse<SwApiFilm>>(endpoint);

    const results: Film[] = data.results.map((film) => ({
      ...film,
      id: this.extractIdFromUrl(film.url),
    }));

    return {
      ...data,
      results,
    };
  }

  async getFilm(id: string): Promise<Film> {
    const data = await this.fetchFromSwapi<SwApiFilm>(`/films/${id}/`);
    return {
      ...data,
      id: this.extractIdFromUrl(data.url),
    };
  }
}