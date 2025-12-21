
import { useForm } from 'react-hook-form';
import { useCreateRequestMutation } from '../../redux/api/piyachokApi';
// import { useNavigate } from 'react-router-dom';
import { useGetVenuesQuery } from '../../redux/api/venueApi';

interface PiyachokCreateFormProps {
  onClose: () => void;
}

interface CreateRequestForm {
  budget: number;
  who_pays: 'me' | 'them' | 'split';
  gender_preference: 'M' | 'F' | 'A';
  preferred_venue_id?: number;
  note?: string;
}

const PiyachokCreateForm = ({ onClose }: PiyachokCreateFormProps) => {
  // const navigate = useNavigate();
  const [createRequest] = useCreateRequestMutation();
  const { data: venues = [] } = useGetVenuesQuery(undefined);

  const { register, handleSubmit, reset } = useForm<CreateRequestForm>({
    defaultValues: {
      budget: 500,
      who_pays: 'split',
      gender_preference: 'A',
      note: '',
    },
  });

  const onSubmit = async (data: CreateRequestForm) => {
    try {
      await createRequest(data).unwrap();
      reset();
      onClose();
      alert('Запит додано! Перевірте ваш профіль.');
    } catch (error) {
      alert('Помилка створення запиту');
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 mb-8">
      <h2 className="text-2xl font-bold mb-6">Створити новий запит</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Бюджет (₴)</label>
          <input
            type="number"
            {...register('budget', { required: true, min: 100 })}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Хто платить</label>
          <select {...register('who_pays')} className="w-full p-3 border border-gray-300 rounded-lg">
            <option value="me">Я оплачую</option>
            <option value="them">Вони оплачують</option>
            <option value="split">Порівну</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Бажана стать</label>
          <select {...register('gender_preference')} className="w-full p-3 border border-gray-300 rounded-lg">
            <option value="A">Будь-яка</option>
            <option value="M">Чоловіча</option>
            <option value="F">Жіноча</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Бажаний заклад (опціонально)</label>
          <select {...register('preferred_venue_id')} className="w-full p-3 border border-gray-300 rounded-lg">
            <option value="">Будь-який заклад</option>
            {venues.map((venue) => (
              <option key={venue.id} value={venue.id}>
                {venue.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Повідомлення (опціонально)</label>
          <textarea
            {...register('note')}
            className="w-full p-3 border border-gray-300 rounded-lg"
            rows={3}
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Створити запит
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
          >
            Скасувати
          </button>
        </div>
      </form>
    </div>
  );
};

export default PiyachokCreateForm;