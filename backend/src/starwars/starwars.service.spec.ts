/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/unbound-method */

import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { AxiosError } from 'axios';
import { of, throwError } from 'rxjs';

import { StarwarsService } from './starwars.service';
import {
  SwapiPaginatedResponse,
  SwApiCharacter,
  SwApiPlanet,
  SwApiStarship,
} from './starwars.types';

describe('StarwarsService', () => {
  let service: StarwarsService;
  let httpService: HttpService;

  const mockBaseUrl = 'https://swapi.dev/api';
  const mockTimeout = 5000;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StarwarsService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn((key) => {
              if (key === 'swapi.baseUrl') return mockBaseUrl;
              if (key === 'swapi.timeout') return mockTimeout;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<StarwarsService>(StarwarsService);
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchFromSwapi', () => {
    it('should return data when request is successful', async () => {
      const mockData = { name: 'Luke Skywalker' };
      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(of({ data: mockData } as any));

      const result = await service['fetchFromSwapi']('/people/1/');

      expect(result).toEqual(mockData);
      expect(httpService.get).toHaveBeenCalledWith(`${mockBaseUrl}/people/1/`, {
        timeout: mockTimeout,
      });
    });

    it('should throw REQUEST_TIMEOUT on timeout', async () => {
      const timeoutError = new AxiosError();
      timeoutError.code = 'ETIMEDOUT';

      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(throwError(() => timeoutError));

      await expect(service['fetchFromSwapi']('/people/1/')).rejects.toThrow(
        new HttpException(
          'Request timeout to SWAPI',
          HttpStatus.REQUEST_TIMEOUT
        )
      );
    });

    it('should throw REQUEST_TIMEOUT on ECONNABORTED', async () => {
      const abortError = new AxiosError();
      abortError.code = 'ECONNABORTED';

      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(throwError(() => abortError));

      await expect(service['fetchFromSwapi']('/people/1/')).rejects.toThrow(
        new HttpException(
          'Request timeout to SWAPI',
          HttpStatus.REQUEST_TIMEOUT
        )
      );
    });

    it('should throw BAD_GATEWAY when response has error', async () => {
      const responseError = new AxiosError();
      responseError.response = { status: 404 } as any;

      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(throwError(() => responseError));

      await expect(service['fetchFromSwapi']('/people/1/')).rejects.toThrow(
        new HttpException('Failed to fetch from SWAPI', HttpStatus.BAD_GATEWAY)
      );
    });

    it('should throw INTERNAL_SERVER_ERROR on connection error', async () => {
      const connectionError = new AxiosError();
      connectionError.code = 'ECONNREFUSED';

      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(throwError(() => connectionError));

      await expect(service['fetchFromSwapi']('/people/1/')).rejects.toThrow(
        new HttpException(
          'Error connecting to SWAPI',
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      );
    });
  });

  describe('extractIdFromUrl', () => {
    it('should extract ID correctly from URL', () => {
      const url = 'https://swapi.dev/api/people/1/';
      const id = service['extractIdFromUrl'](url);

      expect(id).toBe('1');
    });

    it('should extract ID with larger numbers', () => {
      const url = 'https://swapi.dev/api/planets/42/';
      const id = service['extractIdFromUrl'](url);

      expect(id).toBe('42');
    });

    it('should return empty string for URL without ID', () => {
      const url = 'https://swapi.dev/api/people/';
      const id = service['extractIdFromUrl'](url);

      expect(id).toBe('');
    });
  });

  describe('getCharacters', () => {
    const mockPerson: SwApiCharacter = {
      name: 'Luke Skywalker',
      height: '172',
      mass: '77',
      hair_color: 'blond',
      skin_color: 'fair',
      eye_color: 'blue',
      birth_year: '19BBY',
      gender: 'male',
      homeworld: 'https://swapi.dev/api/planets/1/',
      films: [],
      species: [],
      vehicles: [],
      starships: [],
      created: '2014-12-09T13:50:51.644000Z',
      edited: '2014-12-20T21:17:56.891000Z',
      url: 'https://swapi.dev/api/people/1/',
    };

    it('should return list of people from page 1', async () => {
      const mockResponse: SwapiPaginatedResponse<SwApiCharacter> = {
        count: 82,
        next: 'https://swapi.dev/api/people/?page=2',
        previous: null,
        results: [mockPerson],
      };

      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(of({ data: mockResponse } as any));

      const result = await service.getCharacters(1);

      expect(result.results).toHaveLength(1);
      expect(result.results[0]).toHaveProperty('id', '1');
      expect(result.results[0].name).toBe('Luke Skywalker');
      expect(httpService.get).toHaveBeenCalledWith(
        `${mockBaseUrl}/people/?page=1`,
        { timeout: mockTimeout }
      );
    });

    it('should return people with search by name', async () => {
      const mockResponse: SwapiPaginatedResponse<SwApiCharacter> = {
        count: 1,
        next: null,
        previous: null,
        results: [mockPerson],
      };

      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(of({ data: mockResponse } as any));

      const result = await service.getCharacters(1, 'Luke');

      expect(result.results).toHaveLength(1);
      expect(httpService.get).toHaveBeenCalledWith(
        `${mockBaseUrl}/people/?page=1&search=Luke`,
        { timeout: mockTimeout }
      );
    });

    it('should return default page 1 when not specified', async () => {
      const mockResponse: SwapiPaginatedResponse<SwApiCharacter> = {
        count: 82,
        next: null,
        previous: null,
        results: [mockPerson],
      };

      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(of({ data: mockResponse } as any));

      await service.getCharacters();

      expect(httpService.get).toHaveBeenCalledWith(
        `${mockBaseUrl}/people/?page=1`,
        { timeout: mockTimeout }
      );
    });

    it('should encode special characters in search', async () => {
      const mockResponse: SwapiPaginatedResponse<SwApiCharacter> = {
        count: 0,
        next: null,
        previous: null,
        results: [],
      };

      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(of({ data: mockResponse } as any));

      await service.getCharacters(1, 'Leia Organa');

      expect(httpService.get).toHaveBeenCalledWith(
        expect.stringContaining('search=Leia%20Organa'),
        { timeout: mockTimeout }
      );
    });
  });

  describe('getCharacter', () => {
    const mockPerson: SwApiCharacter = {
      name: 'Luke Skywalker',
      height: '172',
      mass: '77',
      hair_color: 'blond',
      skin_color: 'fair',
      eye_color: 'blue',
      birth_year: '19BBY',
      gender: 'male',
      homeworld: 'https://swapi.dev/api/planets/1/',
      films: [],
      species: [],
      vehicles: [],
      starships: [],
      created: '2014-12-09T13:50:51.644000Z',
      edited: '2014-12-20T21:17:56.891000Z',
      url: 'https://swapi.dev/api/people/1/',
    };

    it('should return a person by ID', async () => {
      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(of({ data: mockPerson } as any));

      const result = await service.getCharacter('1');

      expect(result).toHaveProperty('id', '1');
      expect(result.name).toBe('Luke Skywalker');
      expect(httpService.get).toHaveBeenCalledWith(`${mockBaseUrl}/people/1/`, {
        timeout: mockTimeout,
      });
    });

    it('should add extracted ID from URL', async () => {
      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(of({ data: mockPerson } as any));

      const result = await service.getCharacter('1');

      expect(result.id).toBe('1');
    });
  });

  describe('getPlanets', () => {
    const mockPlanet: SwApiPlanet = {
      name: 'Tatooine',
      rotation_period: '23',
      orbital_period: '304',
      diameter: '10465',
      climate: 'arid',
      gravity: '1 standard',
      terrain: 'desert',
      surface_water: '1',
      population: '200000',
      residents: [],
      films: [],
      created: '2014-12-09T13:50:49.641000Z',
      edited: '2014-12-21T20:20:09.469000Z',
      url: 'https://swapi.dev/api/planets/1/',
    };

    it('should return list of planets from page 1', async () => {
      const mockResponse: SwapiPaginatedResponse<SwApiPlanet> = {
        count: 60,
        next: 'https://swapi.dev/api/planets/?page=2',
        previous: null,
        results: [mockPlanet],
      };

      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(of({ data: mockResponse } as any));

      const result = await service.getPlanets(1);

      expect(result.results).toHaveLength(1);
      expect(result.results[0]).toHaveProperty('id', '1');
      expect(result.results[0].name).toBe('Tatooine');
      expect(httpService.get).toHaveBeenCalledWith(
        `${mockBaseUrl}/planets/?page=1`,
        { timeout: mockTimeout }
      );
    });

    it('should return planets with search by name', async () => {
      const mockResponse: SwapiPaginatedResponse<SwApiPlanet> = {
        count: 1,
        next: null,
        previous: null,
        results: [mockPlanet],
      };

      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(of({ data: mockResponse } as any));

      const result = await service.getPlanets(1, 'Tatooine');

      expect(result.results).toHaveLength(1);
      expect(httpService.get).toHaveBeenCalledWith(
        `${mockBaseUrl}/planets/?page=1&search=Tatooine`,
        { timeout: mockTimeout }
      );
    });

    it('should return default page 1 when not specified', async () => {
      const mockResponse: SwapiPaginatedResponse<SwApiPlanet> = {
        count: 60,
        next: null,
        previous: null,
        results: [mockPlanet],
      };

      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(of({ data: mockResponse } as any));

      await service.getPlanets();

      expect(httpService.get).toHaveBeenCalledWith(
        `${mockBaseUrl}/planets/?page=1`,
        { timeout: mockTimeout }
      );
    });
  });

  describe('getPlanet', () => {
    const mockPlanet: SwApiPlanet = {
      name: 'Tatooine',
      rotation_period: '23',
      orbital_period: '304',
      diameter: '10465',
      climate: 'arid',
      gravity: '1 standard',
      terrain: 'desert',
      surface_water: '1',
      population: '200000',
      residents: [],
      films: [],
      created: '2014-12-09T13:50:49.641000Z',
      edited: '2014-12-21T20:20:09.469000Z',
      url: 'https://swapi.dev/api/planets/1/',
    };

    it('should return a planet by ID', async () => {
      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(of({ data: mockPlanet } as any));

      const result = await service.getPlanet('1');

      expect(result).toHaveProperty('id', '1');
      expect(result.name).toBe('Tatooine');
      expect(httpService.get).toHaveBeenCalledWith(
        `${mockBaseUrl}/planets/1/`,
        { timeout: mockTimeout }
      );
    });

    it('should add extracted ID from URL', async () => {
      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(of({ data: mockPlanet } as any));

      const result = await service.getPlanet('1');

      expect(result.id).toBe('1');
    });
  });

  describe('getStarships', () => {
    const mockStarship: SwApiStarship = {
      name: 'X-Wing',
      model: 'T-65 X-wing starfighter',
      manufacturer: 'Incom Corporation',
      cost_in_credits: '149999',
      length: '12.3',
      max_atmosphering_speed: '1050',
      crew: '1',
      passengers: '0',
      cargo_capacity: '110',
      consumables: '5 days',
      hyperdrive_rating: '1.0',
      mglt: '100',
      starship_class: 'Starfighter',
      pilots: [],
      films: [],
      created: '2014-12-12T11:19:05.340000Z',
      edited: '2014-12-12T11:19:05.964596Z',
      url: 'https://swapi.dev/api/starships/12/',
    };

    it('should return list of starships from page 1', async () => {
      const mockResponse: SwapiPaginatedResponse<SwApiStarship> = {
        count: 37,
        next: 'https://swapi.dev/api/starships/?page=2',
        previous: null,
        results: [mockStarship],
      };

      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(of({ data: mockResponse } as any));

      const result = await service.getStarships(1);

      expect(result.results).toHaveLength(1);
      expect(result.results[0]).toHaveProperty('id', '12');
      expect(result.results[0].name).toBe('X-Wing');
      expect(httpService.get).toHaveBeenCalledWith(
        `${mockBaseUrl}/starships/?page=1`,
        { timeout: mockTimeout }
      );
    });

    it('should return starships with search by name', async () => {
      const mockResponse: SwapiPaginatedResponse<SwApiStarship> = {
        count: 1,
        next: null,
        previous: null,
        results: [mockStarship],
      };

      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(of({ data: mockResponse } as any));

      const result = await service.getStarships(1, 'X-Wing');

      expect(result.results).toHaveLength(1);
      expect(httpService.get).toHaveBeenCalledWith(
        `${mockBaseUrl}/starships/?page=1&search=X-Wing`,
        { timeout: mockTimeout }
      );
    });

    it('should return default page 1 when not specified', async () => {
      const mockResponse: SwapiPaginatedResponse<SwApiStarship> = {
        count: 37,
        next: null,
        previous: null,
        results: [mockStarship],
      };

      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(of({ data: mockResponse } as any));

      await service.getStarships();

      expect(httpService.get).toHaveBeenCalledWith(
        `${mockBaseUrl}/starships/?page=1`,
        { timeout: mockTimeout }
      );
    });
  });

  describe('getStarship', () => {
    const mockStarship: SwApiStarship = {
      name: 'X-Wing',
      model: 'T-65 X-wing starfighter',
      manufacturer: 'Incom Corporation',
      cost_in_credits: '149999',
      length: '12.3',
      max_atmosphering_speed: '1050',
      crew: '1',
      passengers: '0',
      cargo_capacity: '110',
      consumables: '5 days',
      hyperdrive_rating: '1.0',
      mglt: '100',
      starship_class: 'Starfighter',
      pilots: [],
      films: [],
      created: '2014-12-12T11:19:05.340000Z',
      edited: '2014-12-12T11:19:05.964596Z',
      url: 'https://swapi.dev/api/starships/12/',
    };

    it('should return a starship by ID', async () => {
      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(of({ data: mockStarship } as any));

      const result = await service.getStarship('12');

      expect(result).toHaveProperty('id', '12');
      expect(result.name).toBe('X-Wing');
      expect(httpService.get).toHaveBeenCalledWith(
        `${mockBaseUrl}/starships/12/`,
        { timeout: mockTimeout }
      );
    });

    it('should add extracted ID from URL', async () => {
      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(of({ data: mockStarship } as any));

      const result = await service.getStarship('12');

      expect(result.id).toBe('12');
    });
  });
});
