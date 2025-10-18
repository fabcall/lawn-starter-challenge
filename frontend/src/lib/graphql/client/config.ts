import { createSearchPolicy } from './cache/policies';

export const apolloConfig = {
  requestTimeout: 10000,
  maxRetries: 3,
  cache: {
    typePolicies: {
      Query: {
        fields: {
          characters: createSearchPolicy(),
          planets: createSearchPolicy(),
          starships: createSearchPolicy(),
        },
      },
    },
  },
} as const;
