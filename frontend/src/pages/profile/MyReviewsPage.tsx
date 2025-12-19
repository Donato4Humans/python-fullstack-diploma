
import { useGetMyReviewsQuery } from '../../redux/api/reviewApi';
import VenueReviewComponent from '../../components/reviews/VenueReviewComponent';

const MyReviewsPage = () => {
  const { data: reviews = [], isLoading } = useGetMyReviewsQuery();

  if (isLoading) {
    return <div className="text-center py-20 text-gray-600">Loading reviews...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Reviews</h1>
      <div className="space-y-6">
        {reviews.map((review) => (
          <VenueReviewComponent key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
};

export default MyReviewsPage;