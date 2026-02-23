import { useParams, useSearchParams } from 'react-router-dom';
import { useGetVenueNewsQuery } from '../../redux/api/newsApi';
import { useGetVenueQuery } from "../../redux/api/venueApi.ts";
import VenueNewsCard from "../../components/news/VenueNewsCard";
import PaginationComponent from "../../components/common/PaginationComponent.tsx";
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const PAGE_SIZE = 1;

const NewsVenuePage = () => {
  const { venueId } = useParams<{ venueId: string }>();
  const venueIdNum = Number(venueId);

  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const { data: news = [], isLoading, isError } = useGetVenueNewsQuery(venueIdNum);
  const { data: venue } = useGetVenueQuery(venueIdNum);

  const totalPages = Math.ceil((news.length || 0) / PAGE_SIZE);
  const paginatedNews = news.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  if (isLoading) {
    return <div className="text-center py-20 text-gray-600">Завантаження новин...</div>;
  }

  if (isError) {
    return <div className="text-center py-20 text-red-600">Помилка завантаження новин</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Link
            to={`/venues/${venueId}`}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Назад до закладу</span>
          </Link>
        </div>

        {venue && (
          <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">
            Новини закладу <span className="text-blue-600">{venue.title}</span>
          </h1>
        )}
        <p className="text-center text-gray-600 mb-12">
          Останні новини та події від {venue?.title}
        </p>

        {paginatedNews.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl mb-6">На цій сторінці немає новин</p>
            {currentPage > 1 && (
              <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
              />
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {paginatedNews.map((newsItem) => (
                <VenueNewsCard key={newsItem.id} news={newsItem} />
              ))}
            </div>

            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default NewsVenuePage;