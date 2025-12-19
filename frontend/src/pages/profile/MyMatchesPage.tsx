
import { useGetMyMatchesQuery, useAcceptMatchMutation } from '../../redux/api/piyachokApi';
import { useAppSelector } from '../../hooks/rtk';
import { useNavigate } from 'react-router-dom';
import {IMatch} from "../../models/IMatch";

const MyMatchesPage = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user.user);
  const { data: matches = [], isLoading } = useGetMyMatchesQuery();
  const [acceptMatch] = useAcceptMatchMutation();

  const handleAccept = async (matchId: number) => {
    try {
      const result = await acceptMatch(matchId).unwrap();
      // Auto-open chat (using context or global state from MainLayout)
      // setChatRoom(result.chat_room); // if using MainLayout context
      // setShowChat(true); // if using MainLayout
      alert(`Match accepted! Chat room: ${result.chat_room}`);
      // Or navigate to chat page if you have one
      navigate(`/chat/${result.chat_room}`);
    } catch (error) {
      alert('Error accepting match');
    }
  };

  if (isLoading) {
    return <div className="text-center py-20 text-gray-600">Loading matches...</div>;
  }

  return (
    <div className="space-y-6">
      {matches.map((match) => (
        <div key={match.id} className="bg-white rounded-xl p-6 shadow-md border">
          <h3 className="text-xl font-bold mb-2">Match with {match.request1.requester_name}</h3>
          <p className="text-gray-600 mb-4">Suggested venue: {match.suggested_venue?.title}</p>
          <button
            onClick={() => handleAccept(match.id)}
            className="bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700"
          >
            Accept Match
          </button>
        </div>
      ))}
    </div>
  );
};

export default MyMatchesPage;