
import { useGetVenueReviewsQuery } from '../../redux/api/reviewApi';
import VenueReviewComponent from './VenueReviewComponent';
import {useSearchParams} from "react-router-dom";
import PaginationComponent from "../common/PaginationComponent.tsx";

interface VenueReviewsComponentProps {
  venueId: number;
}

const PAGE_SIZE = 1;

const VenueReviewsComponent = ({ venueId }: VenueReviewsComponentProps) => {
  const { data: reviews = [], isLoading, isError } = useGetVenueReviewsQuery(venueId);

  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const totalPages = Math.ceil((reviews.length || 0) / PAGE_SIZE);
  const paginatedReviews = reviews.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  if (isLoading) {
    return <div className="text-center py-8 text-gray-600">Loading reviews...</div>;
  }

  if (isError) {
    return <div className="text-center py-8 text-red-600">Error loading reviews</div>;
  }

  return (
    <div className="space-y-10">
      <h2 className="text-3xl font-bold text-gray-900 text-center">
        Відгуки про заклад
      </h2>

      {reviews.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
          <p className="text-gray-500 text-xl">
            Ще немає відгуків про цей заклад
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {paginatedReviews.map((review) => (
              <VenueReviewComponent key={review.id} review={review} />
            ))}
          </div>

          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </>
      )}
    </div>
  );
};


export default VenueReviewsComponent;