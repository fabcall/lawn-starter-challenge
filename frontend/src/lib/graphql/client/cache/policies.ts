import type { FieldFunctionOptions, FieldMergeFunction } from '@apollo/client';

export function createSearchPolicy<T>() {
  const merge: FieldMergeFunction<T[], T[], FieldFunctionOptions> = (
    _existing,
    incoming
  ) => {
    return incoming;
  };

  return {
    keyArgs: ['search'],
    merge,
  };
}
