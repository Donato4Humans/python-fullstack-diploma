import { useParams } from 'react-router-dom';
import { useGetVenueQuery } from '../../redux/api/venueApi';
import VenueCard from '../../components/venues/VenueCard';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const VenuePage = () => {
  const { venueId } = useParams<{ venueId: string }>();
  const venueIdNum = Number(venueId);

  const { data: venue, isLoading, isError } = useGetVenueQuery(venueIdNum);

  if (isLoading) {
    return (
      <div className="text-center py-20 text-gray-600">
        Завантажуємо заклад...
      </div>
    );
  }

  if (isError || !venue) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="max-w-md w-full text-center px-6">
          <div className="text-6xl mb-6">😕</div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Заклад не знайдено
          </h1>

          <p className="text-gray-600 text-lg mb-10">
            На жаль, ми не змогли знайти заклад з таким ID.
            Можливо, його видалили або він ще не опублікований.
          </p>

          <Link
            to="/venues"
            className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-blue-700 transition shadow-lg"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Переглянути всі заклади
          </Link>
        </div>
      </div>
    );
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