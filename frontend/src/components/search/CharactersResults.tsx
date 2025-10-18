import { useQuery } from '@apollo/client/react';

import { LoadingState } from '@/components/shared/LoadingState';
import { NoResultsState } from '@/components/shared/NoResultsState';
import { ResultItem } from '@/components/shared/ResultItem';
import { GET_CHARACTERS } from '@/lib/graphql/queries';
import type { GetCharactersResponse } from '@/lib/graphql/types';
import { ErrorState } from '../shared';

interface CharactersResultsProps {
    searchTerm: string;
}

export function CharactersResults({ searchTerm }: CharactersResultsProps) {
    const { data, loading, error } = useQuery<GetCharactersResponse>(
        GET_CHARACTERS,
        {
            variables: {
                search: searchTerm || undefined,
                page: 1,
            },
            skip: !searchTerm,
        }
    );

    const characters = data?.characters?.results || [];

    if (!searchTerm) {
        return <NoResultsState searchType="characters" hasSearched={false} />;
    }

    if (loading) {
        return <LoadingState />;
    }

    if (error) {
        return (
            <ErrorState
                title="Failed to load characters"
                errorMessage={error.message}
            />
        );
    }

    if (characters.length === 0) {
        return <NoResultsState searchType="characters" hasSearched={true} />;
    }

    return (
        <div className="space-y-3">
            {characters.map((character) => (
                <ResultItem
                    key={character.id}
                    id={character.id}
                    title={character.name}
                    linkTo={`/character/${character.id}`}
                />
            ))}
        </div>
    );
}