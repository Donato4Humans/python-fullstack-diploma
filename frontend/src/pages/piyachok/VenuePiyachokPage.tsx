
import { useParams } from 'react-router-dom';
import VenuePiyachokRequestsComponent from '../../components/piyachok/VenuePiyachokRequestsComponent';
import {useGetVenueQuery} from "../../redux/api/venueApi.ts";

const VenuePiyachokPage = () => {
  const { venueId } = useParams<{ venueId: string }>();
  const venueIdNum = Number(venueId);
  const { data: venue} = useGetVenueQuery(venueIdNum);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
          { venue && (<h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Пиячок запити до закладу {venue.title}
            </h1>)}
        <VenuePiyachokRequestsComponent venueId={venueIdNum} />
      </div>
    </div>
  );
};

export default VenuePiyachokPage;