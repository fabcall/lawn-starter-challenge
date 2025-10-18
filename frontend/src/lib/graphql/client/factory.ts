import { ApolloClient, ApolloLink } from '@apollo/client';

import { cache } from './cache/cache';
import { errorLink, httpLink, retryLink } from './links';

export function createApolloClient() {
  const link = ApolloLink.from([errorLink, httpLink, retryLink]);

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link,
    cache,
    devtools: {
      enabled: true,
    },
  });
}
