
import { useGetVenueNewsQuery } from '../../redux/api/newsApi';
import VenueNewsCard from './VenueNewsCard';

interface VenueNewsComponentProps {
  venueId: number;
}

const VenueNewsComponent = ({ venueId }: VenueNewsComponentProps) => {
  const { data: news = [], isLoading, isError } = useGetVenueNewsQuery(venueId);

  if (isLoading) {
    return <div className="text-center py-8 text-gray-600">Loading news...</div>;
  }

  if (isError) {
    return <div className="text-center py-8 text-red-600">Error loading news</div>;
  }

  if (news.length === 0) {
    return <div className="text-center py-8 text-gray-600">No news yet</div>;
  }

  return (
    <div className="space-y-6">
      {news.map((newsItem) => (
        <VenueNewsCard key={newsItem.id} news={newsItem} />
      ))}
    </div>
  );
};

export default VenueNewsComponent;