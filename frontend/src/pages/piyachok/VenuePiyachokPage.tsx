
import { useParams } from 'react-router-dom';
import { useGetVenueRequestsQuery } from '../../redux/api/piyachokApi';
import PiyachokRequestsComponent from '../../components/piyachok/PiyachokRequestsComponent';

const VenuePiyachokPage = () => {
  const { venueId } = useParams<{ venueId: string }>();
  const venueIdNum = Number(venueId);

  const { data: requests = [], isLoading, isError } = useGetVenueRequestsQuery(venueIdNum);

  if (isLoading) {
    return <div className="text-center py-20 text-gray-600">Loading venue requests...</div>;
  }

  if (isError) {
    return <div className="text-center py-20 text-red-600">Error loading requests</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Piyachok Requests for Venue {venueId}
        </h1>
        <PiyachokRequestsComponent requests={requests} />  {/* Pass as prop or use hook inside component */}
      </div>
    </div>
  );
};

export default VenuePiyachokPage;