
import {useEffect, useState} from 'react';
import { useGetTopVenuesQuery} from '../../redux/api/topApi';
import VenueCard from '../venues/VenueCard';
import {useGetTagsQuery} from "../../redux/api/tagApi";
import {useSearchParams} from "react-router-dom";

interface GeneralTopComponentProps {}

type TopQueryParams = {
  category?: string;
  tag?: string[];
  min_rating?: number;
  max_rating?: number;
  order_by?: 'rating' | 'views' | 'daily_views' | 'newest';
};

const GeneralTopComponent = ({}: GeneralTopComponentProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Mode state
  const [mode, setMode] = useState<'general' | 'category' | 'tag'>(
    (searchParams.get('mode') as any) || 'general'
  );

  // Category state (for category mode)
  const [selectedCategory, setSelectedCategory] = useState<'cafe' | 'restaurant' | 'bar' | 'mixed'>(
    (searchParams.get('category') as any) || 'mixed'
  );

  // Tag state (for tag mode)
  const [selectedTag, setSelectedTag] = useState<string>(
    searchParams.get('tag') || ''
  );

  // Filter states
  const [orderBy, setOrderBy] = useState<'rating' | 'views' | 'daily_views' | 'newest'>(
    (searchParams.get('order_by') as any) || 'rating'
  );
  const [minRating, setMinRating] = useState<number | ''>(
    searchParams.get('min_rating') ? Number(searchParams.get('min_rating')) : ''
  );
  const [maxRating, setMaxRating] = useState<number | ''>(
    searchParams.get('max_rating') ? Number(searchParams.get('max_rating')) : ''
  );

  // Load real tags from backend
  const { data: tags = [], isLoading: tagsLoading } = useGetTagsQuery(undefined);

  // Auto-select first tag if none set and tags loaded
  useEffect(() => {
    if (mode === 'tag' && tags.length > 0 && !selectedTag) {
      setSelectedTag(tags[0].name);
    }
  }, [tags, mode, selectedTag]);

  // Build params for query
  const buildParams = (): TopQueryParams => {
  return Object.fromEntries(
    Object.entries({
      order_by: orderBy,
      category: mode === 'category' ? selectedCategory : undefined,
      tag: mode === 'tag' && selectedTag ? [selectedTag] : undefined,
      min_rating: typeof minRating === 'number' && minRating > 0 ? minRating : undefined,
      max_rating: typeof maxRating === 'number' && maxRating > 0 ? maxRating : undefined,
    }).filter(([_, value]) => value !== undefined)
  ) as TopQueryParams;
};

  const queryParams = buildParams();

  // Query
  const {
    data: venues = [],
    isLoading,
    isError,
    error,
  } = useGetTopVenuesQuery(queryParams);

  // Update URL
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);

    // Mode
    if (mode !== 'general') {
      newParams.set('mode', mode);
    } else {
      newParams.delete('mode');
    }

    // Category
    if (mode === 'category') {
      newParams.set('category', selectedCategory);
    } else {
      newParams.delete('category');
    }

    // Tag
    if (mode === 'tag' && selectedTag) {
      newParams.set('tag', selectedTag);
    } else {
      newParams.delete('tag');
    }

    // Filters (always, if set)
    newParams.set('order_by', orderBy);
    if (typeof minRating === 'number' && minRating > 0) {
      newParams.set('min_rating', minRating.toString());
    } else {
      newParams.delete('min_rating');
    }
    if (typeof maxRating === 'number' && maxRating > 0) {
      newParams.set('max_rating', maxRating.toString());
    } else {
      newParams.delete('max_rating');
    }

    setSearchParams(newParams, { replace: true });
  }, [mode, selectedCategory, selectedTag, orderBy, minRating, maxRating, setSearchParams, searchParams]);

  // Handlers
  const handleModeChange = (newMode: typeof mode) => {
    setMode(newMode);
    // Reset sub-selections if switching away
    if (newMode !== 'category') setSelectedCategory('mixed');
    if (newMode !== 'tag') setSelectedTag('');
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value as typeof selectedCategory);
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTag(e.target.value);
  };

  const handleOrderByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrderBy(e.target.value as typeof orderBy);
  };

  const handleMinRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === '' ? '' : Number(e.target.value);
    setMinRating(val);
  };

  const handleMaxRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === '' ? '' : Number(e.target.value);
    setMaxRating(val);
  };

  // Add this state for validation error (new)
    const [ratingError, setRatingError] = useState<string | null>(null);

    // Validate ratings whenever they change (add this useEffect)
    useEffect(() => {
      if (minRating !== '' && maxRating !== '') {
        const min = Number(minRating);
        const max = Number(maxRating);

        if (min > max) {
          setRatingError('Min rating cannot be greater than max rating');
        } else if (min < 1 || min > 5 || max < 1 || max > 5) {
          setRatingError('Ratings must be between 1 and 5');
        } else {
          setRatingError(null);
        }
      } else {
        setRatingError(null);
      }
    }, [minRating, maxRating]);

  if (isLoading || tagsLoading) {
    return <div className="text-center py-12 text-gray-600">Loading top venues...</div>;
  }

  if (isError) {
    return (
      <div className="text-center py-12 text-red-600">
        Error loading top venues: {error ? (error as any).data?.detail || 'Unknown error' : 'Network issue'}
      </div>
    );
  }

  return (
    <div>
      {/* Mode Selector */}
      <div className="text-center mb-12">
        <div className="inline-flex rounded-lg shadow-lg bg-white p-1">
          <button
            onClick={() => handleModeChange('general')}
            className={`px-6 py-3 rounded-md font-medium transition ${
              mode === 'general' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            General
          </button>
          <button
            onClick={() => handleModeChange('category')}
            className={`px-6 py-3 rounded-md font-medium transition ${
              mode === 'category' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            By Category
          </button>
          <button
            onClick={() => handleModeChange('tag')}
            className={`px-6 py-3 rounded-md font-medium transition ${
              mode === 'tag' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            By Tag
          </button>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        {mode === 'general' && 'General Top'}
        {mode === 'category' && `Top ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}s`}
        {mode === 'tag' && `Top Venues with "${selectedTag || 'select one'}"`}
      </h2>

      {/* Filters Form - always visible */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          {/* Order By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              value={orderBy}
              onChange={handleOrderByChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="-rating">Rating</option>
              <option value="views">Total Views</option>
              <option value="daily_views">Daily Views</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          {/* Min Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Rating</label>
            <input
              type="number"
              min={1}
              max={5}
              step={0.1}
              value={minRating}
              onChange={handleMinRatingChange}
              placeholder="e.g. 4.0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Max Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Rating</label>
            <input
              type="number"
              min={1}
              max={5}
              step={0.1}
              value={maxRating}
              onChange={handleMaxRatingChange}
              placeholder="e.g. 5.0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Mode-specific Selector */}
          {(mode === 'category' || mode === 'tag') && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {mode === 'category' ? 'Category' : 'Tag'}
              </label>
              <select
                value={mode === 'category' ? selectedCategory : selectedTag}
                onChange={mode === 'category' ? handleCategoryChange : handleTagChange}
                disabled={mode === 'tag' && tagsLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {mode === 'category' ? (
                  <>
                    <option value="mixed">Mixed</option>
                    <option value="cafe">Cafes</option>
                    <option value="restaurant">Restaurants</option>
                    <option value="bar">Bars</option>
                  </>
                ) : (
                  tags.map((tag) => (
                    <option key={tag.id} value={tag.name}>
                      {tag.name.charAt(0).toUpperCase() + tag.name.slice(1)}
                    </option>
                  ))
                )}
              </select>
              {mode === 'tag' && tagsLoading && (
                <p className="text-xs text-gray-500 mt-1">Loading tags...</p>
              )}
              {mode === 'tag' && tags.length === 0 && !tagsLoading && (
                <p className="text-xs text-gray-500 mt-1">No tags available</p>
              )}
            </div>
          )}
        </div>
          {ratingError && (
            <p className="text-red-600 text-center mt-4 text-sm font-medium">
              {ratingError}
            </p>
            )}
      </div>

      {/* Results */}
      {venues.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          No venues match your filters yet. Adjust the options above to explore more!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} mode="grid" />
          ))}
        </div>
      )}
    </div>
  );
};

export default GeneralTopComponent;