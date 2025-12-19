
import { useGetVenueRequestsQuery } from '../../redux/api/piyachokApi';
import PiyachokRequestComponent from './PiyachokRequestComponent';

interface VenuePiyachokRequestsComponentProps {
  venueId: number;
}

const VenuePiyachokRequestsComponent = ({ venueId }: VenuePiyachokRequestsComponentProps) => {
  const { data: requests = [], isLoading, isError } = useGetVenueRequestsQuery(venueId);

  if (isLoading) {
    return <div className="text-center py-20 text-gray-600">Loading venue requests...</div>;
  }

  if (isError) {
    return <div className="text-center py-20 text-red-600">Error loading requests</div>;
  }

  if (requests.length === 0) {
    return <div className="text-center py-20 text-gray-600">No requests for this venue</div>;
  }

  return (
    <div className="space-y-6">
      {requests.map((request) => (
        <PiyachokRequestComponent key={request.id} request={request} />
      ))}
    </div>
  );
};

export default VenuePiyachokRequestsComponent;