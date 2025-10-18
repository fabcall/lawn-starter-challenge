import { describe, expect, it } from 'vitest';

import {
  getCharacterImageUrl,
  getImageFallback,
  getPlanetImageUrl,
  getStarshipImageUrl,
} from '@/lib/utils/image.helpers';

describe('Image Helpers', () => {
  const baseUrl =
    'https://vieraboschkova.github.io/swapi-gallery/static/assets/img';

  describe('getCharacterImageUrl', () => {
    it('should return correct URL for character image', () => {
      const result = getCharacterImageUrl('1');
      expect(result).toBe(`${baseUrl}/people/1.jpg`);
    });

    it('should handle different character IDs', () => {
      const result = getCharacterImageUrl('42');
      expect(result).toContain('/people/42.jpg');
    });
  });

  describe('getPlanetImageUrl', () => {
    it('should return correct URL for planet image', () => {
      const result = getPlanetImageUrl('1');
      expect(result).toBe(`${baseUrl}/planets/1.jpg`);
    });
  });

  describe('getStarshipImageUrl', () => {
    it('should return correct URL for starship image', () => {
      const result = getStarshipImageUrl('9');
      expect(result).toBe(`${baseUrl}/starships/9.jpg`);
    });
  });

  describe('getImageFallback', () => {
    it('should return character emoji for character type', () => {
      expect(getImageFallback('character')).toBe('👤');
    });

    it('should return planet emoji for planet type', () => {
      expect(getImageFallback('planet')).toBe('🪐');
    });

    it('should return starship emoji for starship type', () => {
      expect(getImageFallback('starship')).toBe('🚀');
    });
  });
});
