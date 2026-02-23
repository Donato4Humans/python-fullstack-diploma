import { useState } from 'react';
import { useGetGlobalNewsQuery, useCreateNewsMutation, useDeleteNewsMutation } from '../../redux/api/newsApi';
import { useSearchParams } from "react-router-dom";
import PaginationComponent from "../../components/common/PaginationComponent.tsx";
import type { INews } from '../../models/INews';

const PAGE_SIZE = 2;

const AdminGlobalNews = () => {
  const { data: news = [], isLoading } = useGetGlobalNewsQuery();
  const [createNews] = useCreateNewsMutation();
  const [deleteNews] = useDeleteNewsMutation();

  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const totalPages = Math.ceil((news.length || 0) / PAGE_SIZE);
  const paginatedNews = news.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

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

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('content', formData.content);
    submitData.append('type', formData.type);
    submitData.append('is_paid', formData.is_paid.toString());

    if (photo) {
      submitData.append('photo', photo);
    }

    try {
      await createNews(submitData).unwrap();
      setSuccess(true);
      setFormData({ title: '', content: '', type: 'general', is_paid: false });
      setPhoto(null);
      setShowForm(false);
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
    <div className="space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Загальні новини ({news.length})
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          {showForm ? 'Скасувати' : 'Додати новину'}
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-xl text-center font-medium">
          Новини успішно створено!
        </div>
      )}

      {/* Create Form */}
      {showForm && (
        <div className="bg-white shadow-md rounded-2xl p-8">
          <h3 className="text-xl font-semibold mb-6">Створити нову новину</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Введіть заголовок новини"
              />
            </div>

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
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Введіть текст новини"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="general">Загальне</option>
                  <option value="promotion">Промо / Акція</option>
                  <option value="event">Подія</option>
                </select>
              </div>

              <div className="flex items-center pt-8">
                <input
                  type="checkbox"
                  id="is_paid"
                  name="is_paid"
                  checked={formData.is_paid}
                  onChange={handleInputChange}
                  className="h-5 w-5 text-blue-600 rounded border-gray-300"
                />
                <label htmlFor="is_paid" className="ml-3 text-gray-700 font-medium">
                  Платний контент
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-2">
                Фото (необов'язково)
              </label>
              <input
                type="file"
                id="photo"
                accept="image/*"
                onChange={handlePhotoChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {photo && <p className="text-sm text-gray-500 mt-2">Обрано: {photo.name}</p>}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isSubmitting ? 'Створюється...' : 'Опублікувати новину'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ title: '', content: '', type: 'general', is_paid: false });
                  setPhoto(null);
                  setError(null);
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-3.5 rounded-xl font-semibold hover:bg-gray-300 transition"
              >
                Скасувати
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
                {error}
              </div>
            )}
          </form>
        </div>
      )}

      {/* News List */}
      <div className="space-y-6">
        {paginatedNews.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <p className="text-gray-500 text-xl">Немає загальних новин</p>
          </div>
        ) : (
          paginatedNews.map((item: INews) => (
            <div key={item.id} className="bg-white p-6 rounded-2xl shadow border flex justify-between items-start gap-6">
              <div className="flex-1">
                <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-3">
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)} •
                  {item.is_paid ? ' Платний' : ' Безкоштовний'} •
                  {new Date(item.created_at).toLocaleDateString('uk-UA')}
                </p>
                <p className="text-gray-700 line-clamp-3">{item.content}</p>
                {item.photo && (
                  <img
                    src={item.photo}
                    alt={item.title}
                    className="mt-4 w-24 h-24 object-cover rounded-xl"
                  />
                )}
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="bg-red-600 text-white px-5 py-2 rounded-xl hover:bg-red-700 transition text-sm font-medium"
              >
                Видалити
              </button>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="pt-10 flex justify-center">
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

export default AdminGlobalNews;