
import { useGetAdminSponsoredTopQuery, useCreateSponsoredTopMutation } from '../../redux/api/topApi';
import { useGetVenuesQuery } from '../../redux/api/venueApi';

const AdminSponsoredTop = () => {
  const { data: sponsored = [], isLoading: sponsoredLoading } = useGetAdminSponsoredTopQuery();
  const { data: venues = [] } = useGetVenuesQuery(undefined);
  const [createSponsored] = useCreateSponsoredTopMutation();

  const handleAdd = async (venueId: number) => {
    const position = sponsored.length + 1;
    await createSponsored({ venue_id: venueId, position });
  };

  if (sponsoredLoading) return <p>Loading sponsored...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Sponsored Top</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {sponsored.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-xl shadow">
            <p className="font-bold">Position {item.position}</p>
            <p>{item.venue.title}</p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Add Venue to Sponsored</h3>
        <select
          onChange={(e) => e.target.value && handleAdd(Number(e.target.value))}
          className="p-3 border rounded-lg"
        >
          <option value="">Select venue</option>
          {venues.map((venue) => (
            <option key={venue.id} value={venue.id}>
              {venue.title}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AdminSponsoredTop;