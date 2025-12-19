
import { useParams } from 'react-router-dom';
import VenuePiyachokRequestsComponent from '../../components/piyachok/VenuePiyachokRequestsComponent';

const VenuePiyachokPage = () => {
  const { venueId } = useParams<{ venueId: string }>();
  const venueIdNum = Number(venueId);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Piyachok Requests for Venue {venueId}
        </h1>
        <VenuePiyachokRequestsComponent venueId={venueIdNum} />
      </div>
    </div>
  );
};

export default VenuePiyachokPage;