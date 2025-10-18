import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDebounce } from 'ahooks';

import { SearchForm } from '@/components/search/SearchForm';
import { CharactersResults } from '@/components/search/CharactersResults';
import { MoviesResults } from '@/components/search/MoviesResults';

type SearchType = 'characters' | 'movies';

export function SearchPage() {
    const [searchInput, setSearchInput] = useState('');
    const [searchType, setSearchType] = useState<SearchType>('characters');

    const debouncedSearch = useDebounce(searchInput, {
        wait: 500,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // A busca já acontece automaticamente com o debounce
    };

    return (
        <>
            <Helmet>
                <title>Search - SWStarter</title>
                <meta name="description" content="Search Star Wars characters and movies" />
            </Helmet>

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-[380px_1fr] gap-6">
                    <SearchForm
                        searchInput={searchInput}
                        searchType={searchType}
                        isLoading={false}
                        onSearchInputChange={setSearchInput}
                        onSearchTypeChange={setSearchType}
                        onSubmit={handleSubmit}
                    />

                    {/* Card de Resultados (Direita) */}
                    <div className="bg-white rounded-lg shadow-md p-8 min-h-[400px]">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                            Results
                        </h2>

                        {/* Renderiza o componente correto baseado no tipo de busca */}
                        {searchType === 'characters' ? (
                            <CharactersResults searchTerm={debouncedSearch} />
                        ) : (
                            <MoviesResults searchTerm={debouncedSearch} />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}