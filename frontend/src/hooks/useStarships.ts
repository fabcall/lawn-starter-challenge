import type { OperationVariables } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

import { GET_STARSHIPS } from '@/lib/graphql/queries';
import type { GetStarshipsResponse } from '@/lib/graphql/types';
import type { Starship } from '@/types';

interface GetStarshipsVariables extends OperationVariables {
  search?: string;
  page?: number;
}

interface UseStarshipsReturn {
  starships: Starship[] | undefined;
  loading: boolean;
  error: Error | undefined;
  count: number | undefined;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: string | null;
  previousPage: string | null;
  refetch: ReturnType<
    typeof useQuery<GetStarshipsResponse, GetStarshipsVariables>
  >['refetch'];
}

export function useStarships(
  search?: string,
  page: number = 1
): UseStarshipsReturn {
  const { data, loading, error, refetch } = useQuery<
    GetStarshipsResponse,
    GetStarshipsVariables
  >(GET_STARSHIPS, {
    variables: {
      search: search || undefined,
      page,
    },
    fetchPolicy: 'cache-and-network',
  });

  const response = data?.starships;
  const starships = response?.results || [];
  const count = response?.count || 0;
  const nextPage = response?.next || null;
  const previousPage = response?.previous || null;

  return {
    starships,
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
