interface NoResultsStateProps {
    searchType?: 'characters' | 'movies';
    hasSearched?: boolean;
}

export function NoResultsState({
    searchType = 'characters',
    hasSearched = false
}: NoResultsStateProps) {
    const displayType = searchType === 'characters' ? 'People' : 'Movies';

    return (
        <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-medium mb-2">There are zero matches.</p>
            <p className="text-sm">
                {hasSearched
                    ? 'Try a different search term.'
                    : `Use the form to search for ${displayType}.`
                }
            </p>
        </div>
    );
}