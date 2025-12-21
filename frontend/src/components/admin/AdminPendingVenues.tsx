
import {useGetInactiveVenuesQuery,  useUpdateVenueMutation} from '../../redux/api/venueApi';
import VenueCard from '../venues/VenueCard';

const AdminPendingVenues = () => {
  const { data: venues = [], isLoading } = useGetInactiveVenuesQuery();
  const [updateVenue] = useUpdateVenueMutation();

  const handleApprove = async (venueId: number) => {
    await updateVenue({ id: venueId, data: { is_moderated: true } });
  };

  if (isLoading) return <p>Завантаження закладів на модерацію...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Заклади, що очікують на модерацію ({venues.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {venues.map((venue) => (
          <div key={venue.id} className="relative">
            <VenueCard venue={venue} mode="grid" />
            <button
              onClick={() => handleApprove(venue.id)}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700"
            >
              Схвалити публікацію
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPendingVenues;