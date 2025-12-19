
import { useGetActiveRequestsQuery } from '../../redux/api/piyachokApi';
import PiyachokRequestComponent from './PiyachokRequestComponent';

interface PiyachokRequestsComponentProps {
  venueId?: number; // optional for venue filter
}

const PiyachokRequestsComponent = ({ venueId }: PiyachokRequestsComponentProps) => {
  const query = venueId ? { venueId } : undefined;
  const { data: requests = [], isLoading, isError } = useGetVenueRequestsQuery(query || undefined);

  if (isLoading) {
    return <div className="text-center py-20 text-gray-600">Loading requests...</div>;
  }

  if (isError) {
    return <div className="text-center py-20 text-red-600">Error loading requests</div>;
  }

  if (requests.length === 0) {
    return <div className="text-center py-20 text-gray-600">No active requests</div>;
  }

  return (
    <div className="space-y-6">
      {requests.map((request) => (
        <PiyachokRequestComponent key={request.id} request={request} />
      ))}
    </div>
  );
};

export default PiyachokRequestsComponent;