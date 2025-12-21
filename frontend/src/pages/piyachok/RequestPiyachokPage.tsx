import { useParams, useNavigate } from 'react-router-dom';
import { useGetRequestQuery, useJoinRequestMutation } from '../../redux/api/piyachokApi';
// import { useAppSelector } from '../../hooks/rtk';

const RequestPiyachokPage = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  // const user = useAppSelector((state) => state.user.user);
  const { data: request, isLoading, error } = useGetRequestQuery(Number(requestId));
  const [joinRequest, { isLoading: joinLoading }] = useJoinRequestMutation();

  if (isLoading) return <div className="text-center py-12">Завантаження...</div>;
  if (error || !request) return <div className="text-center py-12 text-red-600">Запит не знайдено</div>;

  const isAdmin = request.requester.is_superuser;
  const displayName = isAdmin ? 'Адмін' : (request.requester.profile?.name || request.requester.email.split('@')[0]);

  const handleJoin = async () => {
    try {
      const result = await joinRequest(request.id).unwrap();
      alert(`Приєднався! Кімната чату: ${result.chat_room}`);
      navigate('/piyachok'); // Or to chat later
    } catch (err) {
      alert('Не можу приєднатись');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Деталі запиту на спільний відпочинок
          </h1>

          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Від кого</h2>
              <p className="text-lg text-gray-700">
                <strong>Ім'я:</strong> {displayName}
              </p>
              <p className="text-lg text-gray-700 mt-2">
                <strong>Контакти для зв'язку:</strong> {request.requester.email}
              </p>
              {!isAdmin && request.requester.profile && (
                <>
                  <p className="text-lg text-gray-700 mt-2">
                    <strong>Вік:</strong> {request.requester.profile.age || 'Не вказано'}
                  </p>
                  <p className="text-lg text-gray-700 mt-2">
                    <strong>Стать:</strong> {request.requester.profile.gender || 'Не вказано'}
                  </p>
                  <p className="text-lg text-gray-700 mt-2">
                    <strong>Місто:</strong> {request.requester.profile.city || 'Не вказано'}
                  </p>
                </>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Деталі запиту</h2>
              <p className="text-lg text-gray-700">
                <strong>Бюджет:</strong> {request.budget} ₴
              </p>
              <p className="text-lg text-gray-700 mt-2">
                <strong>Хто платить:</strong> {getWhoPaysText(request.who_pays)}
              </p>
              <p className="text-lg text-gray-700 mt-2">
                <strong>Бажана стать:</strong> {getGenderPreferenceText(request.gender_preference)}
              </p>
              <p className="text-lg text-gray-700 mt-2">
                <strong>Заклад:</strong> {request.venue_title || 'Будь-який'}
              </p>
            </div>
          </div>

          {/* Note */}
          {request.note && (
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">Додаткова інформація</h2>
              <p className="text-lg text-gray-700 italic bg-gray-50 p-6 rounded-xl border border-gray-200">
                {request.note}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-6">
            <button
              onClick={handleJoin}
              disabled={joinLoading}
              className="flex-1 bg-purple-600 text-white py-4 rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-50 text-lg"
            >
              {joinLoading ? 'Приєднуюсь...' : 'Приєднатися та чат'}
            </button>
            <button
              onClick={() => navigate(-1)}
              className="flex-1 bg-gray-200 text-gray-800 py-4 rounded-xl font-semibold hover:bg-gray-300 transition text-lg"
            >
              Назад
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const getWhoPaysText = (whoPays: string) => {
  switch (whoPays) {
    case 'me': return 'Я оплачую';
    case 'them': return 'Вони оплачують';
    case 'split': return 'Порівну';
    default: return whoPays;
  }
};

const getGenderPreferenceText = (gender: string) => {
  switch (gender) {
    case 'M': return 'Чоловіча';
    case 'F': return 'Жіноча';
    case 'A': return 'Будь-яка';
    default: return gender;
  }
};

export default RequestPiyachokPage;