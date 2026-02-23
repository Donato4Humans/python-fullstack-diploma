import { useGetMyMatchesQuery, useAcceptMatchMutation } from '../../redux/api/piyachokApi';
import { useSearchParams } from "react-router-dom";
import PaginationComponent from "../../components/common/PaginationComponent.tsx";
// import { useAppSelector } from '../../hooks/rtk';
// import { useNavigate } from 'react-router-dom';
// import {IMatch} from "../../models/IMatch";

const PAGE_SIZE = 1;

const MyMatchesPage = () => {
  // const navigate = useNavigate();
  // const user = useAppSelector((state) => state.user.user);
  const { data: matches = [], isLoading } = useGetMyMatchesQuery();
  const [acceptMatch] = useAcceptMatchMutation();

  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const totalPages = Math.ceil((matches.length || 0) / PAGE_SIZE);
  const paginatedMatches = matches.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleAccept = async (matchId: number) => {
    try {
      const result = await acceptMatch(matchId).unwrap();
      // Auto-open chat (using context or global state from MainLayout)
      // setChatRoom(result.chat_room); // if using MainLayout context
      // setShowChat(true); // if using MainLayout
      alert(`Match accepted! Chat room: ${result.chat_room}`);
      //navigate(`/chat/${result.chat_room}`);
    } catch (error) {
      alert('Помилка прийняття запиту');
    }
  };

  if (isLoading) {
    return <div className="text-center py-20 text-gray-600">Завантаження прийнятих запитів...</div>;
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Мої схвалені запити</h1>
        <p className="text-gray-600 mt-2">
          Запити Пиячок, які ви прийняли
        </p>
      </div>

      {matches.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
          <p className="text-gray-500 text-xl mb-6">У вас ще немає схвалених запитів</p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {paginatedMatches.map((match) => (
              <div key={match.id} className="bg-white rounded-xl p-6 shadow-md border">
                <h3 className="text-xl font-bold mb-2">
                  Поєднатись з {match.request1.requester.profile.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  Запропонований заклад: {match.suggested_venue?.title || 'Не вказано'}
                </p>
                <button
                  onClick={() => handleAccept(match.id)}
                  className="bg-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700 transition"
                >
                  Прийняти запит
                </button>
              </div>
            ))}
          </div>

          <div className="pt-8">
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default MyMatchesPage;