import { InMemoryCache } from '@apollo/client';

import { apolloConfig } from '../config';

export const cache = new InMemoryCache({
  typePolicies: apolloConfig.cache.typePolicies,
});
