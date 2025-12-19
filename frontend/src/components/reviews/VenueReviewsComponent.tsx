
import { useGetVenueReviewsQuery } from '../../redux/api/reviewApi';
import VenueReviewComponent from './VenueReviewComponent';

interface VenueReviewsComponentProps {
  venueId: number;
}

const VenueReviewsComponent = ({ venueId }: VenueReviewsComponentProps) => {
  const { data: reviews = [], isLoading, isError } = useGetVenueReviewsQuery(venueId);

  if (isLoading) {
    return <div className="text-center py-8 text-gray-600">Loading reviews...</div>;
  }

  if (isError) {
    return <div className="text-center py-8 text-red-600">Error loading reviews</div>;
  }

  if (reviews.length === 0) {
    return <div className="text-center py-8 text-gray-600">No reviews yet</div>;
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <VenueReviewComponent key={review.id} review={review} />
      ))}
    </div>
  );
};

export default VenueReviewsComponent;