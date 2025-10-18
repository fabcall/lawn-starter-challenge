import type { OperationVariables } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

import { GET_STARSHIP } from '@/lib/graphql/queries';
import type { GetStarshipResponse } from '@/lib/graphql/types';
import type { Starship } from '@/types';

interface GetStarshipVariables extends OperationVariables {
  id: string;
}

interface UseStarshipReturn {
  starship: Starship | undefined;
  loading: boolean;
  error: Error | undefined;
  refetch: ReturnType<
    typeof useQuery<GetStarshipResponse, GetStarshipVariables>
  >['refetch'];
}

export function useStarship(id: string): UseStarshipReturn {
  const { data, loading, error, refetch } = useQuery<
    GetStarshipResponse,
    GetStarshipVariables
  >(GET_STARSHIP, {
    variables: { id },
    skip: !id,
    fetchPolicy: 'network-only',
    pollInterval: 0,
  });

  return {
    starship: data?.starship,
    loading,
    error,
    refetch,
  };
}
