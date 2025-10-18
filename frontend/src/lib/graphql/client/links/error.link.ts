import { CombinedGraphQLErrors } from '@apollo/client';
import { ErrorLink } from '@apollo/client/link/error';

export const errorLink = new ErrorLink(({ error }) => {
  if (CombinedGraphQLErrors.is(error)) {
    return error.errors.forEach((error) => {
      const { message, locations, path, extensions } = error;

      console.error(`[GraphQL Error]: ${message}`, {
        locations,
        path,
        errorCode: extensions?.code,
      });
    });
  }

  if ('statusCode' in error) {
    const { statusCode, message } = error;
    console.error(`[Network Error ${statusCode}]: ${message}`);

    // Trata status 401/403
    if (statusCode === 401 || statusCode === 403) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  } else {
    console.error('[Network Error]:', error);
  }
});
