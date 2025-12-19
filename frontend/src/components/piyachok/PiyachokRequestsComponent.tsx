
import { useGetActiveRequestsQuery } from '../../redux/api/piyachokApi';
import PiyachokRequestComponent from './PiyachokRequestComponent';

const PiyachokRequestsComponent = () => {
  const { data: requests = [], isLoading, isError } = useGetActiveRequestsQuery();

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