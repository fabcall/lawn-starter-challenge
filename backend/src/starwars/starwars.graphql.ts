import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Character {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  height: string;

  @Field()
  mass: string;

  @Field()
  hair_color: string;

  @Field()
  skin_color: string;

  @Field()
  eye_color: string;

  @Field()
  birth_year: string;

  @Field()
  gender: string;

  @Field()
  homeworld: string;

  @Field(() => [Film])
  films: string[];

  @Field(() => [String])
  species: string[];

  @Field(() => [String])
  vehicles: string[];

  @Field(() => [String])
  starships: string[];

  @Field()
  created: string;

  @Field()
  edited: string;

  @Field()
  url: string;
}

@ObjectType()
export class CharacterResponse {
  @Field(() => Int)
  count: number;

  @Field(() => String, { nullable: true })
  next: string | null;

  @Field(() => String, { nullable: true })
  previous: string | null;

  @Field(() => [Character])
  results: Character[];
}

@ObjectType()
export class Film {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field(() => Int)
  episode_id: number;

  @Field()
  opening_crawl: string;

  @Field()
  director: string;

  @Field()
  producer: string;

  @Field()
  release_date: string;

  @Field(() => [Character])
  characters: string[];

  @Field(() => [String])
  planets: string[];

  @Field(() => [String])
  starships: string[];

  @Field(() => [String])
  vehicles: string[];

  @Field(() => [String])
  species: string[];

  @Field()
  created: string;

  @Field()
  edited: string;

  @Field()
  url: string;
}

@ObjectType()
export class FilmsResponse {
  @Field(() => Int)
  count: number;

  @Field(() => String, { nullable: true })
  next: string | null;

  @Field(() => String, { nullable: true })
  previous: string | null;

  @Field(() => [Film])
  results: Film[];
}

@ObjectType()
export class Planet {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  rotation_period: string;

  @Field()
  orbital_period: string;

  @Field()
  diameter: string;

  @Field()
  climate: string;

  @Field()
  gravity: string;

  @Field()
  terrain: string;

  @Field()
  surface_water: string;

  @Field()
  population: string;

  @Field(() => [String])
  residents: string[];

  @Field(() => [String])
  films: string[];

  @Field()
  created: string;

  @Field()
  edited: string;

  @Field()
  url: string;
}

@ObjectType()
export class PlanetsResponse {
  @Field(() => Int)
  count: number;

  @Field(() => String, { nullable: true })
  next: string | null;

  @Field(() => String, { nullable: true })
  previous: string | null;

  @Field(() => [Planet])
  results: Planet[];
}

@ObjectType()
export class Starship {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  model: string;

  @Field()
  manufacturer: string;

  @Field()
  cost_in_credits: string;

  @Field()
  length: string;

  @Field()
  max_atmosphering_speed: string;

  @Field()
  crew: string;

  @Field()
  passengers: string;

  @Field()
  cargo_capacity: string;

  @Field()
  consumables: string;

  @Field()
  hyperdrive_rating: string;

  @Field(() => String, { nullable: true })
  mglt: string;

  @Field()
  starship_class: string;

  @Field(() => [String])
  pilots: string[];

  @Field(() => [String])
  films: string[];

  @Field()
  created: string;

  @Field()
  edited: string;

  @Field()
  url: string;
}

@ObjectType()
export class StarshipsResponse {
  @Field(() => Int)
  count: number;

  @Field(() => String, { nullable: true })
  next: string | null;

  @Field(() => String, { nullable: true })
  previous: string | null;

  @Field(() => [Starship])
  results: Starship[];
}