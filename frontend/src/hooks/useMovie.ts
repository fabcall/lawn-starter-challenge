import type { OperationVariables } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

import { GET_FILM } from '@/lib/graphql/queries';
import type { GetFilmResponse } from '@/lib/graphql/types';
import type { Film } from '@/types';

interface GetFilmVariables extends OperationVariables {
    id: string;
}

interface UseMovieReturn {
    film: Film | undefined;
    loading: boolean;
    error: Error | undefined;
    refetch: ReturnType<
        typeof useQuery<GetFilmResponse, GetFilmVariables>
    >['refetch'];
}

export function useMovie(id: string): UseMovieReturn {
    const { data, loading, error, refetch } = useQuery<
        GetFilmResponse,
        GetFilmVariables
    >(GET_FILM, {
        variables: { id },
        skip: !id,
        fetchPolicy: 'network-only',
        pollInterval: 0,
    });

    return {
        film: data?.film,
        loading,
        error,
        refetch,
    };
}