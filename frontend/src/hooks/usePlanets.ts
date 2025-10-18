import type { OperationVariables } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

import { GET_PLANETS } from '@/lib/graphql/queries';
import type { GetPlanetsResponse } from '@/lib/graphql/types';
import type { Planet } from '@/types';

interface GetPlanetsVariables extends OperationVariables {
  search?: string;
  page?: number;
}

interface UsePlanetsReturn {
  planets: Planet[] | undefined;
  loading: boolean;
  error: Error | undefined;
  count: number | undefined;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: string | null;
  previousPage: string | null;
  refetch: ReturnType<
    typeof useQuery<GetPlanetsResponse, GetPlanetsVariables>
  >['refetch'];
}

export function usePlanets(
  search?: string,
  page: number = 1
): UsePlanetsReturn {
  const { data, loading, error, refetch } = useQuery<
    GetPlanetsResponse,
    GetPlanetsVariables
  >(GET_PLANETS, {
    variables: {
      search: search || undefined,
      page,
    },
    fetchPolicy: 'cache-and-network',
  });

  const response = data?.planets;
  const planets = response?.results || [];
  const count = response?.count || 0;
  const nextPage = response?.next || null;
  const previousPage = response?.previous || null;

  return {
    planets,
    loading,
    error,
    count,
    hasNextPage: nextPage !== null && nextPage !== undefined,
    hasPreviousPage: previousPage !== null && previousPage !== undefined,
    nextPage,
    previousPage,
    refetch,
  };
}
