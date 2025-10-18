import { gql } from '@apollo/client';

export const GET_CHARACTERS = gql`
  query GetCharacters($search: String, $page: Int) {
    characters(search: $search, page: $page) {
      count
      next
      previous
      results {
        id
        name
        height
        mass
        hair_color
        skin_color
        eye_color
        birth_year
        gender
        homeworld
      }
    }
  }
`;

export const GET_CHARACTER = gql`
  query GetCharacter($id: String!) {
    character(id: $id) {
      id
      name
      height
      mass
      hair_color
      skin_color
      eye_color
      birth_year
      gender
      homeworld
      
      films {
        id
        title
        episode_id
      }
      
      species
      vehicles
      starships
      created
      edited
      url
    }
  }
`;

export const GET_PLANETS = gql`
  query GetPlanets($search: String, $page: Int) {
    planets(search: $search, page: $page) {
      count
      next
      previous
      results {
        id
        name
        diameter
        rotation_period
        orbital_period
        gravity
        population
        climate
        terrain
        surface_water
      }
    }
  }
`;

export const GET_PLANET = gql`
  query GetPlanet($id: String!) {
    planet(id: $id) {
      id
      name
      diameter
      rotation_period
      orbital_period
      gravity
      population
      climate
      terrain
      surface_water
      residents
      films
      created
      edited
      url
    }
  }
`;

export const GET_STARSHIPS = gql`
  query GetStarships($search: String, $page: Int) {
    starships(search: $search, page: $page) {
      count
      next
      previous
      results {
        id
        name
        model
        manufacturer
        cost_in_credits
        length
        max_atmosphering_speed
        crew
        passengers
        cargo_capacity
        consumables
        hyperdrive_rating
        mglt
        starship_class
      }
    }
  }
`;

export const GET_STARSHIP = gql`
  query GetStarship($id: String!) {
    starship(id: $id) {
      id
      name
      model
      manufacturer
      cost_in_credits
      length
      max_atmosphering_speed
      crew
      passengers
      cargo_capacity
      consumables
      hyperdrive_rating
      mglt
      starship_class
      pilots
      films
      created
      edited
      url
    }
  }
`;

export const GET_FILMS = gql`
  query GetFilms($search: String, $page: Int) {
    films(search: $search, page: $page) {
      count
      next
      previous
      results {
        id
        title
        episode_id
        opening_crawl
        director
        producer
        release_date
        characters
        planets
        starships
        vehicles
        species
        created
        edited
        url
      }
    }
  }
`;

export const GET_FILM = gql`
  query GetFilm($id: String!) {
    film(id: $id) {
      id
      title
      episode_id
      opening_crawl
      director
      producer
      release_date
      
      characters {
        id
        name
      }
      
      planets
      starships
      vehicles
      species
      created
      edited
      url
    }
  }
`;