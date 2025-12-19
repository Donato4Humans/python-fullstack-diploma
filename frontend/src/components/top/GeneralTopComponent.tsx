
import { useState } from 'react';
import { useGetTopVenuesQuery, useGetTopByCategoryQuery, useGetTopByTagQuery } from '../../redux/api/topApi';
import VenueCard from '../venues/VenueCard';
import type {IVenue} from "../../models/IVenue";
import {useGetTagsQuery} from "../../redux/api/tagApi";

interface GeneralTopComponentProps {
  type: 'general' | 'category' | 'tag';
}

const GeneralTopComponent = ({ type }: GeneralTopComponentProps) => {
  const [category, setCategory] = useState<'cafe' | 'restaurant' | 'bar' | 'mixed'>('bar');

  // Load real tags from backend
  const { data: tags = [], isLoading: tagsLoading } = useGetTagsQuery(undefined);

  // Selected tag name (from real tags)
  const [selectedTag, setSelectedTag] = useState<string>(tags[0]?.name || '');

  // General top
  const {
    data: generalData = [],
    isLoading: generalLoading,
    isError: generalError,
  } = useGetTopVenuesQuery(undefined);

  // Category top
  const {
    data: categoryData = [],
    isLoading: categoryLoading,
    isError: categoryError,
  } = useGetTopByCategoryQuery(category);

  // Tag top — uses selectedTag
  const {
    data: tagData = [],
    isLoading: tagLoading,
    isError: tagError,
  } = useGetTopByTagQuery(selectedTag);

  let venues: IVenue[] = [];
  let isLoading = false;
  let isError = false;

  if (type === 'general') {
    venues = generalData;
    isLoading = generalLoading;
    isError = generalError;
  } else if (type === 'category') {
    venues = categoryData;
    isLoading = categoryLoading;
    isError = categoryError;
  } else if (type === 'tag') {
    venues = tagData;
    isLoading = tagLoading || tagsLoading;
    isError = tagError;
  }

  if (isLoading) {
    return <div className="text-center py-12 text-gray-600">Loading top venues...</div>;
  }

  if (isError) {
    return <div className="text-center py-12 text-red-600">Error loading top venues</div>;
  }

  if (venues.length === 0) {
    return <div className="text-center py-12 text-gray-600">No venues found</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        {type === 'general' && 'General Top'}
        {type === 'category' && `Top ${category.charAt(0).toUpperCase() + category.slice(1)}s`}
        {type === 'tag' && `Top Venues with "${selectedTag}"`}
      </h2>

      {/* Controls */}
      {(type === 'category' || type === 'tag') && (
        <div className="text-center mb-12">
          <select
            value={type === 'category' ? category : selectedTag}
            onChange={(e) =>
              type === 'category'
                ? setCategory(e.target.value as typeof category)
                : setSelectedTag(e.target.value)
            }
            disabled={type === 'tag' && tagsLoading}
            className="px-8 py-4 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-md"
          >
            {type === 'category' ? (
              <>
                <option value="cafe">Cafes</option>
                <option value="restaurant">Restaurants</option>
                <option value="bar">Bars</option>
                <option value="mixed">Mixed</option>
              </>
            ) : (
              tags.map((tag) => (
                <option key={tag.id} value={tag.name}>
                  {tag.name.charAt(0).toUpperCase() + tag.name.slice(1)}
                </option>
              ))
            )}
          </select>

          {type === 'tag' && tagsLoading && (
            <p className="text-gray-500 mt-2">Loading tags...</p>
          )}
          {type === 'tag' && tags.length === 0 && !tagsLoading && (
            <p className="text-gray-500 mt-2">No tags available</p>
          )}
        </div>
      )}

      {/* Venues grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {venues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} mode="grid" />
        ))}
      </div>
    </div>
  );
};

export default GeneralTopComponent;