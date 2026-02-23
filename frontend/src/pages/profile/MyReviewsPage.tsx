import { useGetMyReviewsQuery } from '../../redux/api/reviewApi';
import VenueReviewComponent from '../../components/reviews/VenueReviewComponent';
import { useSearchParams } from "react-router-dom";
import PaginationComponent from "../../components/common/PaginationComponent.tsx";

const PAGE_SIZE = 1;

const MyReviewsPage = () => {
  const { data: reviews = [], isLoading } = useGetMyReviewsQuery();

  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const totalPages = Math.ceil((reviews.length || 0) / PAGE_SIZE);
  const paginatedReviews = reviews.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  if (isLoading) {
    return <div className="text-center py-20 text-gray-600">Завантаження відгуків...</div>;
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Мої відгуки</h1>
        <p className="text-gray-600 mt-2">
          Усі відгуки, які ви залишили на сторінках закладів
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
          <p className="text-gray-500 text-xl mb-6">Ви ще не залишили жодного відгуку</p>
          <a
            href="/venues"
            className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-blue-700 transition"
          >
            Переглянути заклади та залишити відгук
          </a>
        </div>
      ) : (
        <>
          <div className="space-y-8">
            {paginatedReviews.map((review) => (
              <VenueReviewComponent key={review.id} review={review} />
            ))}
          </div>

          <div className="pt-8">
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default MyReviewsPage;