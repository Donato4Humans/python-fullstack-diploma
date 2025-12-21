import { useState } from 'react';
import { useGetGlobalNewsQuery, useCreateNewsMutation, useDeleteNewsMutation } from '../../redux/api/newsApi';
import type { INews } from '../../models/INews';

const AdminGlobalNews = () => {
  const { data: news = [], isLoading } = useGetGlobalNewsQuery();
  const [createNews] = useCreateNewsMutation();
  const [deleteNews] = useDeleteNewsMutation();

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'general' as 'general' | 'promotion' | 'event',
    is_paid: false,
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'is_paid' ? (e.target as HTMLInputElement).checked : value,
    }));
    setError(null);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required');
      setIsSubmitting(false);
      return;
    }

    // Create FormData for submission
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('content', formData.content);
    submitData.append('type', formData.type);
    submitData.append('is_paid', formData.is_paid.toString());
    // No venue_id for global news

    if (photo) {
      submitData.append('photo', photo);
    }

    try {
      await createNews(submitData).unwrap();
      setSuccess(true);
      // Reset form
      setFormData({ title: '', content: '', type: 'general', is_paid: false });
      setPhoto(null);
      setShowForm(false);
      // Hide success after 3s
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.data?.detail || 'Failed to create news. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete news?')) {
      await deleteNews(id);
    }
  };

  if (isLoading) return <p className="text-center py-8 text-gray-600">Завантажуються новини...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Загальні новини ({news.length})</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          {showForm ? 'Скасувати' : 'Додати новини'}
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
          Новини успішно створено!
        </div>
      )}

      {/* Create Form */}
      {showForm && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Створити новину</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
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
                placeholder="Введіть заголовок"
              />
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Вміст *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Введіть вміст новини"
              />
            </div>

            {/* Type */}
            <div>
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
                <option value="general">Загальне</option>
                <option value="promotion">Промо</option>
                <option value="event">Подія</option>
              </select>
            </div>

            {/* Is Paid */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_paid"
                name="is_paid"
                checked={formData.is_paid}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_paid" className="ml-2 block text-sm text-gray-700">
                Платний контент
              </label>
            </div>

            {/* Photo */}
            <div>
              <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-2">
                Фото (необов'язково)
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

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Створюється...' : 'Створити'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ title: '', content: '', type: 'general', is_paid: false });
                  setPhoto(null);
                  setError(null);
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
              >
                Скасувати
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                {error}
              </div>
            )}
          </form>
        </div>
      )}

      {/* News List */}
      <div className="space-y-4">
        {news.length === 0 ? (
          <p className="text-center py-8 text-gray-600">Немає новин</p>
        ) : (
          news.map((item: INews) => (
            <div key={item.id} className="bg-white p-6 rounded-xl shadow flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-2">
                  Тип: {item.type.charAt(0).toUpperCase() + item.type.slice(1)} |{' '}
                  {item.is_paid ? 'Платний' : 'Безкоштовний'}
                </p>
                <p className="text-gray-600 mb-2">Створено: {new Date(item.created_at).toLocaleDateString()}</p>
                <p className="text-gray-700">{item.content.substring(0, 150)}...</p>
                {item.photo && (
                  <img src={item.photo} alt={item.title} className="mt-2 w-20 h-20 object-cover rounded" />
                )}
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 ml-4"
              >
                Видалити
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminGlobalNews;