import {useNavigate, useParams} from "react-router-dom";
import {useCreateNewsMutation} from "../../redux/api/newsApi.ts";
import {useState} from "react";

const CreateNewsPage: React.FC = () => {
  const { venueId } = useParams<{ venueId: string }>();
  const navigate = useNavigate();

  const [createNews, { isLoading, error }] = useCreateNewsMutation();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'general' as 'general' | 'promotion' | 'event',
    is_paid: false,
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'is_paid' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate venueId
    if (!venueId) {
      alert('Invalid venue ID');
      return;
    }

    // Create FormData for multipart upload
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('content', formData.content);
    submitData.append('type', formData.type);
    submitData.append('is_paid', formData.is_paid.toString());
    submitData.append('venue_id', venueId);

    if (photo) {
      submitData.append('photo', photo);
    }

    try {
      await createNews(submitData).unwrap();
      setSuccess(true);

      // Auto-redirect after 7s
      setTimeout(() => {
        navigate(`/venues/${venueId}`);
      }, 7000);
    } catch (err) {
      console.error('Не вдалось створити новину:', err);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-green-600 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Новина створена!</h2>
          <p className="text-gray-600 mb-6">Вашу новину закладу було опубліковано.</p>
          <button
            onClick={() => navigate(`/venues/${venueId}`)}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Подивитись заклад
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Створити новину закладу</h1>

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
          {/* Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Заголовок *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Введіть заголовок новин"
            />
          </div>

          {/* Content */}
          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Вміст *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Введіть новину"
            />
          </div>

          {/* Type */}
          <div className="mb-4">
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Тип *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="general">Загальна</option>
              <option value="promotion">Промо</option>
              <option value="event">Подія</option>
            </select>
          </div>

          {/* Is Paid */}
          <div className="mb-4">
            <label htmlFor="is_paid" className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <input
                type="checkbox"
                id="is_paid"
                name="is_paid"
                checked={formData.is_paid}
                onChange={handleInputChange}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              Реклама
            </label>
          </div>

          {/* Photo */}
          <div className="mb-6">
            <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-2">
              Фото (Опціонально)
            </label>
            <input
              type="file"
              id="photo"
              name="photo"
              accept="image/*"
              onChange={handlePhotoChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {photo && <p className="text-sm text-gray-500 mt-1">Обрано: {photo.name}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Створення...' : 'Створити новину'}
          </button>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              Error: {(error as any).data?.detail || 'Не вдалось створити новину. Спробуйте будь-ласка ще раз.'}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateNewsPage;