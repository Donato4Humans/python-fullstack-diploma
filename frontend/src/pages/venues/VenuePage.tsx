
import { useParams } from 'react-router-dom';
import { useGetVenueQuery } from '../../redux/api/venueApi';
import VenueCard from '../../components/venues/VenueCard';

const VenuePage = () => {
  const { venueId } = useParams<{ venueId: string }>();
  const venueIdNum = Number(venueId);

  const { data: venue, isLoading, isError } = useGetVenueQuery(venueIdNum);

  if (isLoading) {
    return <div className="text-center py-20 text-gray-600">Loading venue...</div>;
  }

  if (isError || !venue) {
    return <div className="text-center py-20 text-red-600">Venue not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <VenueCard venue={venue} mode="detail" />
      </div>
    </div>
  );
};

export default VenuePage;