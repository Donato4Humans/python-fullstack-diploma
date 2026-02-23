import { Link, useSearchParams} from 'react-router-dom';
import { useGetVenueRequestsQuery } from '../../redux/api/piyachokApi';
import { useGetVenueQuery } from '../../redux/api/venueApi';
import PiyachokRequestComponent from './PiyachokRequestComponent';
import PaginationComponent from "../common/PaginationComponent.tsx";
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface VenuePiyachokRequestsComponentProps {
  venueId: number;
}

const PAGE_SIZE = 1;

const VenuePiyachokRequestsComponent = ({ venueId }: VenuePiyachokRequestsComponentProps) => {

  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const { data: requests = [], isLoading, isError } = useGetVenueRequestsQuery(venueId);
  const { data: venue } = useGetVenueQuery(venueId);

  const totalPages = Math.ceil((requests.length || 0) / PAGE_SIZE);
  const paginatedRequests = requests.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  if (isLoading) {
    return <div className="text-center py-20 text-gray-600">Завантажуємо запити закладу...</div>;
  }

  if (isError) {
    return <div className="text-center py-20 text-red-600">Помилка завантаження запитів</div>;
  }

  return (
    <div className="space-y-12">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Link
          to={`/venues/${venueId}`}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition font-medium"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Назад до закладу
        </Link>
      </div>

      {venue && (
        <h1 className="text-4xl font-bold text-gray-900 text-center">
          Запити до закладу <span className="text-blue-600">«{venue.title}»</span>
        </h1>
      )}

      {requests.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
          <p className="text-gray-500 text-xl mb-8">Наразі немає активних запитів до цього закладу</p>

          <Link
            to={`/venues/${venueId}`}
            className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-blue-700 transition"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Повернутися до сторінки закладу
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {paginatedRequests.map((request) => (
              <PiyachokRequestComponent key={request.id} request={request} />
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

export default VenuePiyachokRequestsComponent;