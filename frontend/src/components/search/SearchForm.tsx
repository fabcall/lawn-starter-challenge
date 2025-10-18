import { type FormEvent } from 'react';

type SearchType = 'characters' | 'movies';

interface SearchFormProps {
    searchInput: string;
    searchType: SearchType;
    isLoading: boolean;
    onSearchInputChange: (value: string) => void;
    onSearchTypeChange: (type: SearchType) => void;
    onSubmit: (e: FormEvent) => void;
}

export function SearchForm({
    searchInput,
    searchType,
    isLoading,
    onSearchInputChange,
    onSearchTypeChange,
    onSubmit,
}: SearchFormProps) {
    const placeholder =
        searchType === 'characters'
            ? 'e.g. Chewbacca, Yoda, Boba Fett'
            : 'e.g. A New Hope, Empire Strikes Back';

    return (
        <div className="bg-white rounded-lg shadow-md p-8 h-fit">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
                What are you searching for?
            </h2>

            <form onSubmit={onSubmit}>
                <div className="flex gap-6 mb-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="searchType"
                            value="characters"
                            checked={searchType === 'characters'}
                            onChange={(e) => onSearchTypeChange(e.target.value as SearchType)}
                            className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-gray-800 font-medium">People</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="searchType"
                            value="movies"
                            checked={searchType === 'movies'}
                            onChange={(e) => onSearchTypeChange(e.target.value as SearchType)}
                            className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-gray-800 font-medium">Movies</span>
                    </label>
                </div>

                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => onSearchInputChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-700 mb-6"
                />

                <button
                    type="submit"
                    disabled={!searchInput.trim() || isLoading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-md transition-colors shadow-sm uppercase tracking-wide"
                >
                    {isLoading ? 'SEARCHING...' : 'SEARCH'}
                </button>
            </form>
        </div>
    );
}