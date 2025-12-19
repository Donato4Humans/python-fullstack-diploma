
import { Link } from 'react-router-dom';
import { useJoinRequestMutation } from '../../redux/api/piyachokApi';
import type {IPiyachokRequest} from "../../models/IPiyachokRequest";

const PiyachokRequestComponent = ({ request }: { request: IPiyachokRequest }) => {
  const [joinRequest, { isLoading }] = useJoinRequestMutation();

  const handleJoin = async () => {
    try {
      const result = await joinRequest(request.id).unwrap();
      // On success, navigate to chat or show success message
      alert(`Joined! Chat room: ${result.chat_room}`);
      // Or open WebSocket chat if online
    } catch (error) {
      alert('Cannot join this request');
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{request.requester.profile.name}</h3>
          <p className="text-sm text-gray-600">Budget: {request.budget} ₴</p>
          <p className="text-sm text-gray-600">Pays: {request.who_pays}</p>
          <p className="text-sm text-gray-600">Gender preference: {request.gender_preference}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Venue: {request.venue_title}</p>
          <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
            Pending
          </span>
        </div>
      </div>

      {request.note && (
        <p className="text-gray-700 mb-4 italic">{request.note}</p>
      )}

      <div className="flex gap-4">
        <button
          onClick={handleJoin}
          disabled={isLoading}
          className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
        >
          {isLoading ? 'Joining...' : 'Join & Chat'}
        </button>
        <Link
          to={`/piyachok/requests/${request.id}`}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg text-center font-semibold hover:bg-gray-300 transition"
        >
          Details
        </Link>
      </div>
    </div>
  );
};

export default PiyachokRequestComponent;