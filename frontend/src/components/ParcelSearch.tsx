import React, { useState, useEffect } from 'react';
import { Search, X, MapPin, Leaf } from 'lucide-react';
import { useAppSelector } from '@/hooks/useAppRedux';

interface SearchResult {
  id: number;
  surveyNumber: string;
  village: string;
  district: string;
  status: string;
  ndvi: number;
}

const ParcelSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'survey' | 'village' | 'district'>('survey');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { parcels } = useAppSelector((state) => state.data);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    const term = searchTerm.toLowerCase();

    const filtered = parcels.filter((p) => {
      switch (searchType) {
        case 'survey':
          return p.surveyNumber.toLowerCase().includes(term);
        case 'village':
          return p.villageName.toLowerCase().includes(term);
        case 'district':
          return p.districtName.toLowerCase().includes(term);
        default:
          return false;
      }
    });

    const searchResults: SearchResult[] = filtered.map((p) => ({
      id: p.id,
      surveyNumber: p.surveyNumber,
      village: p.villageName,
      district: p.districtName,
      status: p.currentStatus,
      ndvi: p.ndviValue || 0,
    }));

    setResults(searchResults);
    setIsSearching(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CROPPED':
        return 'text-green-400';
      case 'LIKELY_CROPPED':
        return 'text-yellow-400';
      case 'FALLOW':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
        <Search size={20} />
        <span>Search Parcels</span>
      </h2>

      {/* Search Type Selection */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {(['survey', 'village', 'district'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setSearchType(type)}
            className={`py-2 px-3 rounded text-sm font-medium transition-colors ${
              searchType === type
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder={`Search by ${searchType}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white
            focus:outline-none focus:border-blue-500 placeholder-gray-500"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-medium transition-colors"
        >
          Search
        </button>
      </div>

      {/* Results */}
      <div className="max-h-96 overflow-y-auto">
        {isSearching ? (
          <div className="text-center py-8 text-gray-400">Searching...</div>
        ) : results.length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-400 mb-3">{results.length} results found</p>
            {results.map((result) => (
              <div
                key={result.id}
                className="bg-gray-800 border border-gray-700 rounded p-3 hover:border-blue-500
                  cursor-pointer transition-all hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-white flex items-center space-x-2">
                      <MapPin size={16} />
                      <span>{result.surveyNumber}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {result.village}, {result.district}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${getStatusColor(result.status)}`}>
                      {result.status}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center space-x-1 mt-1">
                      <Leaf size={12} />
                      <span>NDVI: {result.ndvi.toFixed(2)}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : searchTerm ? (
          <div className="text-center py-8 text-gray-400">No results found</div>
        ) : (
          <div className="text-center py-8 text-gray-400">Enter search term and press search</div>
        )}
      </div>
    </div>
  );
};

export default ParcelSearch;
