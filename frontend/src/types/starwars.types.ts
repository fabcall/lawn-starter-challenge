export interface Character {
  id: string;
  name: string;
  height?: string;
  mass?: string;
  hairColor?: string;
  skinColor?: string;
  eyeColor?: string;
  birthYear?: string;
  gender?: string;
  homeworld?: Planet;

  films?: Film[];

  species?: string[];
  vehicles?: Starship[];
  starships?: Starship[];
  created?: string;
  edited?: string;
}

export interface Planet {
  id: string;
  name: string;
  diameter?: string;
  rotationPeriod?: string;
  orbitalPeriod?: string;
  gravity?: string;
  population?: string;
  climate?: string;
  terrain?: string;
  surfaceWater?: string;
  residents?: Character[];
  films?: string[];
  created?: string;
  edited?: string;
}

export interface Starship {
  id: string;
  name: string;
  model?: string;
  manufacturer?: string;
  costInCredits?: string;
  length?: string;
  maxAtmospheringSpeed?: string;
  crew?: string;
  passengers?: string;
  cargoCapacity?: string;
  consumables?: string;
  hyperdriveRating?: string;
  mglt?: string;
  starshipClass?: string;
  pilots?: Character[];
  films?: string[];
  created?: string;
  edited?: string;
}

export interface Film {
  id: string;
  title: string;
  episodeId?: number;
  openingCrawl?: string;
  director?: string;
  producer?: string;
  releaseDate?: string;

  characters?: Character[];

  planets?: string[];
  starships?: string[];
  vehicles?: string[];
  species?: string[];
  created?: string;
  edited?: string;
  url?: string;
}