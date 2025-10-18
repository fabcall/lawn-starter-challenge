import { describe, expect, it } from 'vitest';

import { capitalize } from '@/lib/utils/string.helpers';

describe('capitalize', () => {
  it('should capitalize the first letter of a string', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('should handle single character strings', () => {
    expect(capitalize('a')).toBe('A');
  });

  it('should not affect already capitalized strings', () => {
    expect(capitalize('Hello')).toBe('Hello');
  });

  it('should handle empty strings', () => {
    expect(capitalize('')).toBe('');
  });

  it('should preserve the rest of the string', () => {
    expect(capitalize('jedi training')).toBe('Jedi training');
  });
});
