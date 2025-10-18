import { ErrorState } from '@/components/shared';
import { LoadingState } from '@/components/shared/LoadingState';
import { NoResultsState } from '@/components/shared/NoResultsState';
import { ResultItem } from '@/components/shared/ResultItem';
import { useMovies } from '@/hooks';

interface MoviesResultsProps {
  searchTerm: string;
}

export function MoviesResults({ searchTerm }: MoviesResultsProps) {
  const { films, loading, error } = useMovies(searchTerm || undefined, 1);

  if (!searchTerm) {
    return <NoResultsState searchType="movies" hasSearched={false} />;
  }

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load movies"
        errorMessage={error.message}
      />
    );
  }

  if (!films || films.length === 0) {
    return <NoResultsState searchType="movies" hasSearched={true} />;
  }

  return (
    <div className="space-y-3">
      {films.map((film) => (
        <ResultItem
          key={film.id}
          id={film.id}
          title={film.title}
          linkTo={`/movie/${film.id}`}
        />
      ))}
    </div>
  );
}