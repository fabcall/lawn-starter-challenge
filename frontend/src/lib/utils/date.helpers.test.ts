import { describe, expect, it } from 'vitest';

import { formatDate } from '@/lib/utils/date.helpers';

describe('formatDate', () => {
  it('should format a valid ISO date string', () => {
    const result = formatDate('2024-01-15T12:00:00Z');
    expect(result).toContain('January');
    expect(result).toContain('15');
    expect(result).toContain('2024');
  });

  it('should return a properly formatted string', () => {
    const result = formatDate('2023-12-31T23:59:59Z');
    expect(result).toMatch(/\w+\s\d+,\s\d{4}/);
  });
});
