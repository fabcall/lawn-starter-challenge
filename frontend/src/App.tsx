import { HelmetProvider } from 'react-helmet-async';
import { RouterProvider } from 'react-router';

import { ApolloProvider } from '@apollo/client/react';

import { ErrorBoundary } from '@/components/shared';

import { apolloClient } from './lib/graphql/client';
import { routes } from './routes/routes';

export function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <ApolloProvider client={apolloClient}>
          <RouterProvider router={routes} />
        </ApolloProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
