import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router';

import { LoadingState } from '@/components/shared/LoadingState';
import { DetailPageLayout } from '@/components/shared/DetailPageLayout';
import { DetailSection } from '@/components/shared/DetailSection';
import { ErrorState } from '@/components/shared/ErrorState';
import { useMovie } from '@/hooks';

export function MovieDetailPage() {
    const { id = '' } = useParams();
    const { film, loading, error } = useMovie(id);

    if (loading) {
        return <LoadingState message="Loading movie..." />;
    }

    if (error || !film) {
        return <ErrorState title="Movie not found" maxWidth="5xl" />;
    }

    return (
        <>
            <Helmet>
                <title>{film.title} - SWStarter</title>
            </Helmet>

            <DetailPageLayout title={film.title} maxWidth="5xl">
                <div className="grid md:grid-cols-2 gap-12 mb-12">
                    <DetailSection title="Opening Crawl">
                        {film.openingCrawl ? (
                            <>
                                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {film.openingCrawl}
                                </div>

                                {(film.director || film.producer || film.releaseDate || film.episodeId) && (
                                    <div className="mt-6 pt-6 border-t border-gray-200 space-y-2 text-sm text-gray-700">
                                        {film.episodeId && (
                                            <p>
                                                <span className="font-medium">Episode:</span>{' '}
                                                {film.episodeId}
                                            </p>
                                        )}
                                        {film.director && (
                                            <p>
                                                <span className="font-medium">Director:</span>{' '}
                                                {film.director}
                                            </p>
                                        )}
                                        {film.producer && (
                                            <p>
                                                <span className="font-medium">Producer:</span>{' '}
                                                {film.producer}
                                            </p>
                                        )}
                                        {film.releaseDate && (
                                            <p>
                                                <span className="font-medium">Release Date:</span>{' '}
                                                {new Date(film.releaseDate).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </>
                        ) : (
                            <p className="text-gray-500 italic">No opening crawl available</p>
                        )}
                    </DetailSection>

                    <div>
                        <DetailSection title="Characters">
                            {film.characters && film.characters.length > 0 ? (
                                <div className="flex flex-wrap gap-x-2 gap-y-1">
                                    {film.characters.map((character, idx) => (
                                        <span key={character.id}>
                                            <Link
                                                to={`/character/${character.id}`}
                                                className="text-blue-500 hover:text-blue-600 hover:underline cursor-pointer"
                                            >
                                                {character.name}
                                            </Link>
                                            {idx < film.characters!.length - 1 && ','}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">No characters available</p>
                            )}
                        </DetailSection>

                        {film.planets && film.planets.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                    Planets
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {film.planets.length} planet(s)
                                </p>
                            </div>
                        )}

                        {film.starships && film.starships.length > 0 && (
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                    Starships
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {film.starships.length} starship(s)
                                </p>
                            </div>
                        )}

                        {film.vehicles && film.vehicles.length > 0 && (
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                    Vehicles
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {film.vehicles.length} vehicle(s)
                                </p>
                            </div>
                        )}

                        {film.species && film.species.length > 0 && (
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                    Species
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {film.species.length} species
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </DetailPageLayout>
        </>
    );
}