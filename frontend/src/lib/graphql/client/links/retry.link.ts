import { RetryLink } from '@apollo/client/link/retry';

import { apolloConfig } from '../config';

export const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: 3000,
    jitter: true,
  },

  attempts: {
    max: apolloConfig.maxRetries,

    retryIf: (error) => {
      const doNotRetry = [
        'GRAPHQL_PARSE_FAILED',
        'GRAPHQL_VALIDATION_FAILED',
        'BAD_REQUEST',
        'INTERNAL_ERROR',
      ];

      if (doNotRetry.some((code) => error.message?.includes(code))) {
        return false;
      }

      return !!error;
    },
  },
});
