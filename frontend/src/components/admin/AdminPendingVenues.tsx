// AdminPendingVenues.tsx - Fixed stretching and overlaps
import { useGetInactiveVenuesQuery, useUpdateVenueMutation } from '../../redux/api/venueApi';
import VenueCard from '../venues/VenueCard';

const AdminPendingVenues = () => {
  const { data: venues = [], isLoading } = useGetInactiveVenuesQuery();
  const [updateVenue] = useUpdateVenueMutation();

  const handleApprove = async (venueId: number) => {
    const formData = new FormData();
    formData.append('is_moderated', 'true');
    await updateVenue({ id: venueId, data: formData });
  };

  if (isLoading) return <p className="text-center py-12 text-gray-600 text-xl">Завантаження...</p>;

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-extrabold mb-10 text-gray-900 text-center">
        Заклади на модерації ({venues.length})
      </h2>
      {venues.length === 0 ? (
        <p className="text-center py-12 text-gray-500 text-lg font-medium">
          Немає закладів на модерації
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {venues.map((venue) => (
            <div key={venue.id} className="flex flex-col bg-gray-50 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="flex-1">
                <VenueCard venue={venue} mode="grid" />
              </div>
              <div className="p-4 bg-white rounded-b-2xl">
                <button
                  onClick={() => handleApprove(venue.id)}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition shadow-lg"
                >
                  Схвалити публікацію
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPendingVenues;