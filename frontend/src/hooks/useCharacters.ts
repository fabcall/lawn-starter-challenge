import type { OperationVariables } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

import { GET_CHARACTERS } from '@/lib/graphql/queries';
import type { GetCharactersResponse } from '@/lib/graphql/types';
import type { Character } from '@/types';

interface GetCharactersVariables extends OperationVariables {
  search?: string;
  page?: number;
}

interface UseCharactersReturn {
  characters: Character[] | undefined;
  loading: boolean;
  error: Error | undefined;
  count: number | undefined;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: string | null;
  previousPage: string | null;
  refetch: ReturnType<
    typeof useQuery<GetCharactersResponse, GetCharactersVariables>
  >['refetch'];
}

export function useCharacters(
  search?: string,
  page: number = 1
): UseCharactersReturn {
  const { data, loading, error, refetch } = useQuery<
    GetCharactersResponse,
    GetCharactersVariables
  >(GET_CHARACTERS, {
    variables: {
      search: search || undefined,
      page,
    },
    fetchPolicy: 'cache-and-network',
  });

  const response = data?.characters;
  const characters = response?.results || [];
  const count = response?.count || 0;
  const nextPage = response?.next || null;
  const previousPage = response?.previous || null;

  return {
    characters,
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
