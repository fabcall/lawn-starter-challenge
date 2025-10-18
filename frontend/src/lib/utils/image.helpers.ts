const SWAPI_GALLERY_BASE =
  'https://vieraboschkova.github.io/swapi-gallery/static/assets/img';

export function getCharacterImageUrl(characterId: string): string {
  return `${SWAPI_GALLERY_BASE}/people/${characterId}.jpg`;
}

export function getPlanetImageUrl(planetId: string): string {
  return `${SWAPI_GALLERY_BASE}/planets/${planetId}.jpg`;
}

export function getStarshipImageUrl(starshipId: string): string {
  return `${SWAPI_GALLERY_BASE}/starships/${starshipId}.jpg`;
}

export function getImageFallback(
  type: 'character' | 'planet' | 'starship'
): string {
  const fallbacks = {
    character: '👤',
    planet: '🪐',
    starship: '🚀',
  };
  return fallbacks[type];
}
