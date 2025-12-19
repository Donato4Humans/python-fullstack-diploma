
import { useParams } from 'react-router-dom';
import { useGetVenueNewsQuery } from '../../redux/api/newsApi';
import VenueNewsCard from "../../components/news/VenueNewsCard";

const NewsVenuePage = () => {
  const { venueId } = useParams<{ venueId: string }>();
  const venueIdNum = Number(venueId);

  const { data: news = [], isLoading, isError } = useGetVenueNewsQuery(venueIdNum);

  if (isLoading) {
    return <div className="text-center py-20 text-gray-600">Loading news...</div>;
  }

  if (isError) {
    return <div className="text-center py-20 text-red-600">Error loading news</div>;
  }

  if (news.length === 0) {
    return <div className="text-center py-20 text-gray-600">No news for this venue</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          News for Venue {venueId}
        </h1>
        <div className="space-y-6">
          {news.map((newsItem) => (
            <VenueNewsCard key={newsItem.id} news={newsItem} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsVenuePage;