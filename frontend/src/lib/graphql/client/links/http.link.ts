import { HttpLink } from '@apollo/client';

import { apolloConfig } from '../config';

export const httpLink = new HttpLink({
  uri: '/graphql',
  credentials: 'include',
  fetch: customFetch,
});

function customFetch(uri: RequestInfo | URL, options?: RequestInit) {
  if (import.meta.env.DEV) {
    console.log('[GraphQL Request]', uri);
  }
  return fetch(uri, {
    ...options,
    signal: AbortSignal.timeout(apolloConfig.requestTimeout),
  });
}
