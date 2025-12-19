
import { useGetSponsoredTopQuery } from '../../redux/api/topApi';
import VenueCard from '../venues/VenueCard';

const SponsoredTopComponent = () => {
  const { data: sponsored = [], isLoading, isError } = useGetSponsoredTopQuery();

  if (isLoading) {
    return <div className="text-center py-8 text-gray-600">Loading sponsored tops...</div>;
  }

  if (isError || sponsored.length === 0) {
    return <div className="text-center py-8 text-gray-600">No sponsored venues</div>;
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Sponsored Top
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sponsored.map((item) => (
          <VenueCard key={item.id} venue={item.venue} mode="grid" />
        ))}
      </div>
    </div>
  );
};

export default SponsoredTopComponent;