import type { OperationVariables } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

import { GET_FILMS } from '@/lib/graphql/queries';
import type { GetFilmsResponse } from '@/lib/graphql/types';
import type { Film } from '@/types';

interface GetFilmsVariables extends OperationVariables {
    search?: string;
    page?: number;
}

interface UseMoviesReturn {
    films: Film[] | undefined;
    loading: boolean;
    error: Error | undefined;
    count: number | undefined;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: string | null;
    previousPage: string | null;
    refetch: ReturnType<
        typeof useQuery<GetFilmsResponse, GetFilmsVariables>
    >['refetch'];
}

export function useMovies(
    search?: string,
    page: number = 1
): UseMoviesReturn {
    const { data, loading, error, refetch } = useQuery<
        GetFilmsResponse,
        GetFilmsVariables
    >(GET_FILMS, {
        variables: {
            search: search || undefined,
            page,
        },
        fetchPolicy: 'cache-and-network',
    });

    const response = data?.films;
    const films = response?.results || [];
    const count = response?.count || 0;
    const nextPage = response?.next || null;
    const previousPage = response?.previous || null;

    return {
        films,
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