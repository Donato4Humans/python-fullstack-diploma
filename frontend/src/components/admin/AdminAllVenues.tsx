import {useDeleteVenueMutation, useGetVenuesQuery, useTransferVenueOwnershipMutation} from '../../redux/api/venueApi';
import VenueCard from '../venues/VenueCard';
import {Link} from 'react-router-dom';
import {getUserRole} from "../../helpers/getRole";
import {useAppSelector} from "../../hooks/rtk";
import {RoleEnum} from "../../enums/RoleEnum";

const AdminAllVenues = () => {
  const { user } = useAppSelector((state) => state.user);
  const { data: venues = [], isLoading } = useGetVenuesQuery(undefined);
  const [deleteVenue] = useDeleteVenueMutation();
  const [transferVenueOwnership] = useTransferVenueOwnershipMutation();

  const handleDelete = async (venueId: number) => {
    if (confirm('Видалити заклад ?')) {
      await deleteVenue(venueId);
    }
  };

  let isSuperAdmin : boolean = false
  const role = getUserRole(user);
  if(role === RoleEnum.SUPERADMIN){
      isSuperAdmin = true;
  }

  if (isLoading) return <p>Завантаження всіх закладів...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Всі заклади ({venues.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {venues.map((venue) => (
          <div key={venue.id} className="relative">
            <VenueCard venue={venue} mode="grid" />
            <div className="absolute top-2 right-2 space-x-2">
              <Link
                to={`/profile/edit-venue/${venue.id}`}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                Змінити
              </Link>
              <button
                onClick={() => handleDelete(venue.id)}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                Видалити
              </button>

                {isSuperAdmin && (
                  <button
                    onClick={() => {
                      const newOwnerId = prompt('Enter new owner user ID:');
                      if (newOwnerId) {
                        transferVenueOwnership({ id: venue.id, new_owner_id: Number(newOwnerId) });
                      }
                    }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded text-sm"
                  >
                    Змінити власника
                  </button>
                )}

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAllVenues;