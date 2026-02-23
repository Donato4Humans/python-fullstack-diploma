import { useGetMyVenuesQuery } from '../../redux/api/venueApi';
import { useDeleteVenueMutation } from '../../redux/api/venueApi';
import VenueCard from '../../components/venues/VenueCard';
import { Link, useSearchParams } from "react-router-dom";
import PaginationComponent from "../../components/common/PaginationComponent.tsx";

const PAGE_SIZE = 1;

const MyVenuesPage = () => {
  const { data: venues = [], isLoading } = useGetMyVenuesQuery();
  const [deleteVenue] = useDeleteVenueMutation();

  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const totalPages = Math.ceil((venues.length || 0) / PAGE_SIZE);
  const paginatedVenues = venues.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleDelete = async (venueId: number) => {
    if (confirm('Ви дійсно хочете видалити цей заклад?')) {
      await deleteVenue(venueId);
    }
  };

  if (isLoading) {
    return <div className="text-center py-20 text-gray-600">Завантаження закладів...</div>;
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Мої заклади</h1>

        <Link
          to="/profile/create-venue"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition flex items-center gap-2"
        >
          + Додати новий заклад
        </Link>
      </div>

      {venues.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
          <p className="text-gray-500 text-xl mb-6">У вас ще немає закладів</p>
          <Link
            to="/profile/create-venue"
            className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-blue-700 transition"
          >
            Створити перший заклад
          </Link>
        </div>
      ) : (
        <>
          {/* Venues Grid - Adjusted for sidebar layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {paginatedVenues.map((venue) => (
              <div key={venue.id} className="relative group">
                <VenueCard
                  venue={venue}
                  mode="grid"
                  isOwnerView={true}
                />

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <Link
                    to={`/profile/edit-venue/${venue.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 shadow"
                  >
                    Редагувати
                  </Link>
                  <button
                    onClick={() => handleDelete(venue.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 shadow"
                  >
                    Видалити
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
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

export default MyVenuesPage;