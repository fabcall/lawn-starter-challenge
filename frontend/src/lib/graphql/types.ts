import type { Character, Film, Planet, Starship } from '@/types';

export interface GetCharactersResponse {
    characters: {
        count: number;
        next: string | null;
        previous: string | null;
        results: Character[];
    };
}

export interface GetCharacterResponse {
    character: Character;
}

export interface GetPlanetsResponse {
    planets: {
        count: number;
        next: string | null;
        previous: string | null;
        results: Planet[];
    };
}

export interface GetPlanetResponse {
    planet: Planet;
}

export interface GetStarshipsResponse {
    starships: {
        count: number;
        next: string | null;
        previous: string | null;
        results: Starship[];
    };
}

export interface GetStarshipResponse {
    starship: Starship;
}


export interface GetFilmsResponse {
    films: {
        count: number;
        next: string | null;
        previous: string | null;
        results: Film[];
    };
}

export interface GetFilmResponse {
    film: Film;
}