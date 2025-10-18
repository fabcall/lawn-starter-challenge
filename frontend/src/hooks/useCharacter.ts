import type { OperationVariables } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

import { GET_CHARACTER } from '@/lib/graphql/queries';
import type { GetCharacterResponse } from '@/lib/graphql/types';
import type { Character } from '@/types';

interface GetCharacterVariables extends OperationVariables {
  id: string;
}

interface UseCharacterReturn {
  character: Character | undefined;
  loading: boolean;
  error: Error | undefined;
  refetch: ReturnType<
    typeof useQuery<GetCharacterResponse, GetCharacterVariables>
  >['refetch'];
}

export function useCharacter(id: string): UseCharacterReturn {
  const { data, loading, error, refetch } = useQuery<
    GetCharacterResponse,
    GetCharacterVariables
  >(GET_CHARACTER, {
    variables: { id },
    skip: !id,
    fetchPolicy: 'network-only',
    pollInterval: 0,
  });

  return {
    character: data?.character,
    loading,
    error,
    refetch,
  };
}
