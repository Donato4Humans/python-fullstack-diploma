
import { useForm } from 'react-hook-form';
import { useCreateVenueMutation  } from '../../redux/api/venueApi';
import {useAddTagToVenueMutation, useGetTagsQuery} from '../../redux/api/tagApi';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface CreateVenueForm {
  title: string;
  description: string;
  schedule: string;
  average_check: number;
  category: 'cafe' | 'restaurant' | 'bar' | 'mixed';
  street: string;
  city: string;
  region: string;
  country: string;
  house: number;
  latitude?: number;
  longitude?: number;
}

const CreateVenuePage = () => {
  const navigate = useNavigate();
  const [createVenue] = useCreateVenueMutation();
  const [addTagToVenue] = useAddTagToVenueMutation();
  const { data: tags = [], isLoading: tagsLoading } = useGetTagsQuery(undefined);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  const { register, handleSubmit, formState: {  } } = useForm<CreateVenueForm>();

  const onSubmit = async (data: CreateVenueForm) => {
    try {
      const result = await createVenue(data).unwrap();
      // Add selected tags
      for (const tagId of selectedTags) {
        await addTagToVenue({ venueId: result.id, tag_id: tagId });
      }
      navigate('/profile/my-venues');
    } catch (error) {
      alert('Помилка створення закладу');
    }
  };

  const toggleTag = (tagId: number) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-8">Створити новий заклад</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Назва *</label>
            <input {...register('title', { required: true })} className="w-full p-3 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Категорія *</label>
            <select {...register('category', { required: true })} className="w-full p-3 border rounded-lg">
              <option value="">Оберіть категорію</option>
              <option value="cafe">Кафе</option>
              <option value="restaurant">Ресторан</option>
              <option value="bar">Бар</option>
              <option value="mixed">Різне</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Опис закладу</label>
          <textarea {...register('description')} rows={4} className="w-full p-3 border rounded-lg" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Середній чек (₴) *</label>
            <input type="number" {...register('average_check', { required: true })} className="w-full p-3 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Графік</label>
            <input {...register('schedule')} className="w-full p-3 border rounded-lg" placeholder="e.g. Mon-Sun 10:00-22:00" />
          </div>
        </div>

        {/* Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Вулиця *</label>
            <input {...register('street', { required: true })} className="w-full p-3 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Будинок *</label>
            <input type="number" {...register('house', { required: true })} className="w-full p-3 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Місто *</label>
            <input {...register('city', { required: true })} className="w-full p-3 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Регіон *</label>
            <input {...register('region', { required: false })} className="w-full p-3 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Країна *</label>
            <input {...register('country', { required: false })} className="w-full p-3 border rounded-lg" />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-bold mb-4">Теги</label>
          {tagsLoading ? (
            <p>Завантаження тегів...</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`px-4 py-2 rounded-full border transition ${
                    selectedTags.includes(tag.id)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pt-6">
          <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition">
            Створити заклад
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateVenuePage;