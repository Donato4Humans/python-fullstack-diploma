import { Link } from 'react-router-dom';
import { useJoinRequestMutation } from '../../redux/api/piyachokApi';
import type { IPiyachokRequest } from "../../models/IPiyachokRequest";

const PiyachokRequestComponent = ({ request }: { request: IPiyachokRequest }) => {
  const [joinRequest, { isLoading }] = useJoinRequestMutation();

  // Safely get display name
  const getDisplayName = () => {
    const requester = request.requester;

    // If requester is admin/superuser
    if (requester.is_superuser) {
      return 'Адмін';
    }

    // Try profile name first
    if (requester.profile?.name) {
      return requester.profile.name;
    }

    // Fallback to email prefix
    if (requester.email) {
      return requester.email.split('@')[0];
    }

    // Ultimate fallback
    return 'Анонім';
  };

  // Translate who_pays
  const getWhoPaysText = (whoPays: string) => {
    switch (whoPays) {
      case 'me':
        return 'Я оплачую';
      case 'them':
        return 'Вони оплачують';
      case 'split':
        return 'Порівну';
      default:
        return whoPays;
    }
  };

  // Translate gender_preference
  const getGenderPreferenceText = (gender: string) => {
    switch (gender) {
      case 'M':
        return 'Чоловіча';
      case 'F':
        return 'Жіноча';
      case 'A':
        return 'Будь-яка';
      default:
        return gender;
    }
  };

  let title: string = ''
  if(!request.venue_title){
      title = 'Будь-який'
  }

  const handleJoin = async () => {
    try {
      const result = await joinRequest(request.id).unwrap();
      alert(`Приєднався! Кімната чату: ${result.chat_room}`);
      // Optionally navigate or open chat
    } catch (error) {
      alert('Не можу приєднатись до кімнати');
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{getDisplayName()}</h3>
          <p className="text-sm text-gray-600">Бюджет: {request.budget} ₴</p>
          <p className="text-sm text-gray-600">Хто платить: {getWhoPaysText(request.who_pays)}</p>
          <p className="text-sm text-gray-600">Бажана стать: {getGenderPreferenceText(request.gender_preference)}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Заклад: {title}</p>
          <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
            Очікує
          </span>
        </div>
      </div>

      {request.note && (
        <p className="text-gray-700 mb-4 italic">{request.note}</p>
      )}

      {/* Contact email (always shown) */}
      <p className="text-sm text-gray-700 mb-6">
        <strong>Контакти для зв'язку:</strong> {request.requester.email}
      </p>

      <div className="flex gap-4">
        <button
          onClick={handleJoin}
          disabled={isLoading}
          className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
        >
          {isLoading ? 'Підключення...' : 'Приєднуйся та спілкуйся'}
        </button>
        <Link
          to={`/piyachok/requests/${request.id}`}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg text-center font-semibold hover:bg-gray-300 transition"
        >
          Деталі
        </Link>
      </div>
    </div>
  );
};

export default PiyachokRequestComponent;