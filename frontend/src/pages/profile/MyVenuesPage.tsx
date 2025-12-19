
import { useGetMyVenuesQuery } from '../../redux/api/venueApi';
import { useDeleteVenueMutation } from '../../redux/api/venueApi';
import VenueCard from '../../components/venues/VenueCard';
import {Link} from "react-router-dom";

const MyVenuesPage = () => {
  const { data: venues = [], isLoading } = useGetMyVenuesQuery();
  const [deleteVenue] = useDeleteVenueMutation();

  const handleDelete = async (venueId: number) => {
    if (confirm('Delete venue?')) {
      await deleteVenue(venueId);
    }
  };

  if (isLoading) {
    return <div className="text-center py-20 text-gray-600">Loading venues...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Venues</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {venues.map((venue) => (
          <div key={venue.id} className="relative">
            <VenueCard venue={venue} mode="grid" isOwnerView={true} />
            {/* Edit/Delete buttons on top */}
            <div className="absolute top-2 right-2 space-x-2">
              <Link to={`/profile/edit-venue/${venue.id}`} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                Edit
              </Link>
              <button onClick={() => handleDelete(venue.id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyVenuesPage;