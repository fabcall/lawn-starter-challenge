import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';

import { LoadingState } from '@/components/shared/LoadingState';
import { DetailPageLayout } from '@/components/shared/DetailPageLayout';
import { DetailSection } from '@/components/shared/DetailSection';
import { ErrorState } from '@/components/shared/ErrorState';
import { useCharacter } from '@/hooks';
import { useParams } from 'react-router';

export function CharacterDetailPage() {
  const { id = '' } = useParams();
  const { character, loading, error } = useCharacter(id);

  if (loading) {
    return <LoadingState message="Loading character..." />;
  }

  if (error || !character) {
    return <ErrorState title="Character not found" />;
  }

  return (
    <>
      <Helmet>
        <title>{character.name} - SWStarter</title>
      </Helmet>

      <DetailPageLayout title={character.name}>
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <DetailSection title="Details">
            <div className="space-y-2 text-gray-700">
              {character.birthYear && (
                <p>
                  <span className="font-medium">Birth Year:</span>{' '}
                  {character.birthYear}
                </p>
              )}
              {character.gender && (
                <p>
                  <span className="font-medium">Gender:</span>{' '}
                  {character.gender}
                </p>
              )}
              {character.eyeColor && (
                <p>
                  <span className="font-medium">Eye Color:</span>{' '}
                  {character.eyeColor}
                </p>
              )}
              {character.hairColor && (
                <p>
                  <span className="font-medium">Hair Color:</span>{' '}
                  {character.hairColor}
                </p>
              )}
              {character.height && (
                <p>
                  <span className="font-medium">Height:</span>{' '}
                  {character.height}
                </p>
              )}
              {character.mass && (
                <p>
                  <span className="font-medium">Mass:</span> {character.mass}
                </p>
              )}
            </div>
          </DetailSection>

          <DetailSection title="Movies">
            {character.films && character.films.length > 0 ? (
              <div className="space-y-2">
                {character.films.map((film) => (
                  <div key={film.id}>
                    <Link
                      to={`/movie/${film.id}`}
                      className="text-blue-500 hover:text-blue-600 hover:underline cursor-pointer font-medium text-left"
                    >
                      {film.title}
                      {film.episodeId && ` (Episode ${film.episodeId})`}
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No movies available</p>
            )}
          </DetailSection>
        </div>
      </DetailPageLayout>
    </>
  );
}