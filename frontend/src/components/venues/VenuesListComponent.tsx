
import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearchVenuesQuery } from '../../redux/api/searchApi';
import VenueCard from './VenueCard';
import PaginationComponent from '../common/PaginationComponent';
import type {ISearchParams} from "../../models/ISearch";

const PAGE_SIZE = 12;

// Haversine formula — distance in km between two points
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const VenuesListComponent = () => {
  const [searchParams] = useSearchParams();

  // Read params safely
  const getParam = (key: string) => searchParams.get(key) || undefined;

  const rawCategory = getParam('category');
  const validCategories = ['cafe', 'restaurant', 'bar', 'mixed'] as const;
  const category = rawCategory && validCategories.includes(rawCategory as any)
    ? rawCategory as ISearchParams['category']
    : undefined;

  const params: ISearchParams = {
    q: getParam('q'),
    category,
    min_rating: getParam('min_rating') ? Number(getParam('min_rating')) : undefined,
    max_rating: getParam('max_rating') ? Number(getParam('max_rating')) : undefined,
    min_price: getParam('min_price') ? Number(getParam('min_price')) : undefined,
    max_price: getParam('max_price') ? Number(getParam('max_price')) : undefined,
    tag: searchParams.getAll('tag').length ? searchParams.getAll('tag') : undefined,
    order_by: getParam('order_by') as ISearchParams['order_by'],
  };

  const currentPage = Number(getParam('page')) || 1;

  // Geolocation
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Check if user wants distance sorting (from search form)
  const sortByDistance = searchParams.get('sort') === 'distance'; // we'll use 'sort' param

  useEffect(() => {
    if (sortByDistance  && !coords && !geoError) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setGeoError(null);
        },
        () => {
          setGeoError('Geolocation access denied. Cannot sort by distance.');
        },
        { timeout: 10000 }
      );
    }
  }, [sortByDistance , coords, geoError]);

  const { data, isLoading, isError } = useSearchVenuesQuery(params);

  // Sort by distance client-side if needed
  const sortedVenues = useMemo(() => {
    if (!data?.results || !coords || !sortByDistance ) {
      return data?.results || [];
    }

    return [...data.results].sort((a, b) => {
      if (!a.latitude || !a.longitude || !b.latitude || !b.longitude) return 0;
      const distA = getDistance(coords.lat, coords.lng, a.latitude, a.longitude);
      const distB = getDistance(coords.lat, coords.lng, b.latitude, b.longitude);
      return distA - distB;
    });
  }, [data?.results, coords, sortByDistance ]);

  const total = sortedVenues.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const paginatedVenues = sortedVenues.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  if (isLoading) {
    return <div className="text-center py-20 text-gray-600">Loading venues...</div>;
  }

  if (isError) {
    return <div className="text-center py-20 text-red-600">Error loading venues</div>;
  }

  if (sortedVenues.length === 0) {
    return <div className="text-center py-20 text-gray-600">No venues found</div>;
  }

  return (
    <div>
      {geoError && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded-lg mb-8 text-center">
          {geoError}
        </div>
      )}

      {sortByDistance  && coords && (
        <div className="text-center text-gray-600 mb-6">
          Sorted by distance from your location
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
        {paginatedVenues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>

      {totalPages > 1 && (
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            const newParams = new URLSearchParams(searchParams);
            newParams.set('page', String(page));
            window.scrollTo(0, 0);
            // update URL without reload
            window.history.pushState({}, '', `/venues?${newParams.toString()}`);
          }}
        />
      )}
    </div>
  );
};

export default VenuesListComponent;