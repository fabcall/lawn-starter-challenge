import type { OperationVariables } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

import { GET_PLANET } from '@/lib/graphql/queries';
import type { GetPlanetResponse } from '@/lib/graphql/types';
import type { Planet } from '@/types';

interface GetPlanetVariables extends OperationVariables {
  id: string;
}

interface UsePlanetReturn {
  planet: Planet | undefined;
  loading: boolean;
  error: Error | undefined;
  refetch: ReturnType<
    typeof useQuery<GetPlanetResponse, GetPlanetVariables>
  >['refetch'];
}

export function usePlanet(id: string): UsePlanetReturn {
  const { data, loading, error, refetch } = useQuery<
    GetPlanetResponse,
    GetPlanetVariables
  >(GET_PLANET, {
    variables: { id },
    skip: !id,
    fetchPolicy: 'network-only',
    pollInterval: 0,
  });

  return {
    planet: data?.planet,
    loading,
    error,
    refetch,
  };
}
