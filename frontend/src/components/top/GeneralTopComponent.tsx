
import { useState } from 'react';
import { useGetTopVenuesQuery, useGetTopByCategoryQuery, useGetTopByTagQuery } from '../../redux/api/topApi';
import VenueCard from '../venues/VenueCard';

interface GeneralTopComponentProps {
  type: 'sponsored' | 'category' | 'tag' | 'general';
}

const GeneralTopComponent = ({ type }: GeneralTopComponentProps) => {
  const [category, setCategory] = useState('bar');
  const [tag, setTag] = useState('wifi');

  // Fetch based on type
  let data = [];
  let isLoading = false;
  let isError = false;

  if (type === 'general') {
    const { data: generalData, isLoading: generalLoading, isError: generalError } = useGetTopVenuesQuery();
    data = generalData || [];
    isLoading = generalLoading;
    isError = generalError;
  } else if (type === 'category') {
    const { data: categoryData, isLoading: categoryLoading, isError: categoryError } = useGetTopByCategoryQuery(category);
    data = categoryData || [];
    isLoading = categoryLoading;
    isError = categoryError;
    return (
      <div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mb-4 px-4 py-2 border rounded-lg"
        >
          <option value="cafe">Cafes</option>
          <option value="restaurant">Restaurants</option>
          <option value="bar">Bars</option>
          <option value="mixed">Mixed</option>
        </select>
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : isError ? (
          <div className="text-center py-8 text-red-600">Error</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.map((venue) => (
              <VenueCard key={venue.id} venue={venue} mode="grid" />
            ))}
          </div>
        )}
      </div>
    );
  } else if (type === 'tag') {
    const { data: tagData, isLoading: tagLoading, isError: tagError } = useGetTopByTagQuery(tag);
    data = tagData || [];
    isLoading = tagLoading;
    isError = tagError;
    return (
      <div>
        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="mb-4 px-4 py-2 border rounded-lg"
        >
          <option value="wifi">WiFi</option>
          <option value="terrace">Terrace</option>
          <option value="live_music">Live Music</option>
          <option value="pet_friendly">Pet Friendly</option>
          {/* Add more tags */}
        </select>
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : isError ? (
          <div className="text-center py-8 text-red-600">Error</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.map((venue) => (
              <VenueCard key={venue.id} venue={venue} mode="grid" />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center py-8 text-gray-600">Loading general top...</div>;
  }

  if (isError) {
    return <div className="text-center py-8 text-red-600">Error loading general top</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        General Top
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.map((venue) => (
          <VenueCard key={venue.id} venue={venue} mode="grid" />
        ))}
      </div>
    </div>
  );
};

export default GeneralTopComponent;