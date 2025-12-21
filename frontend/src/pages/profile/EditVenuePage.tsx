import { useParams, useNavigate } from 'react-router-dom';
import { useGetVenueQuery, useUpdateVenueMutation } from '../../redux/api/venueApi';
import { useAddTagToVenueMutation, useGetTagsQuery, useGetVenueTagsQuery } from '../../redux/api/tagApi';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { useEffect, useState } from 'react';
import {schema} from "../../validators/venue_validator.ts";

interface EditVenueForm {
  title: string;
  description?: string;
  schedule: string;
  average_check: number;
  category: 'cafe' | 'restaurant' | 'bar' | 'mixed';
  street: string;
  city: string;
  region?: string;
  country?: string;
  house: number;
  latitude?: number;
  longitude?: number;
}

const EditVenuePage = () => {
  const { venueId } = useParams<{ venueId: string }>();
  const venueIdNum = Number(venueId);
  const navigate = useNavigate();

  const { data: venue } = useGetVenueQuery(venueIdNum);
  const { data: venueTags = [] } = useGetVenueTagsQuery(venueIdNum);
  const { data: allTags = [], isLoading: tagsLoading } = useGetTagsQuery(undefined);
  const [updateVenue] = useUpdateVenueMutation();
  const [addTagToVenue] = useAddTagToVenueMutation();

  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [photo, setPhoto] = useState<File | null>(null);

  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<EditVenueForm>({
    resolver: joiResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      schedule: '',
      average_check: 0,
      category: 'mixed' as const,
      street: '',
      city: '',
      region: '',
      country: '',
      house: 0,
      latitude: undefined,
      longitude: undefined,
    },
  });

  useEffect(() => {
    if (venue) {
      setValue('title', venue.title);
      setValue('description', venue.description || '');
      setValue('schedule', venue.schedule || '');
      setValue('average_check', venue.average_check);
      setValue('category', venue.category);
      setValue('street', venue.street);
      setValue('city', venue.city);
      setValue('region', venue.region || '');
      setValue('country', venue.country || '');
      setValue('house', venue.house);
      setValue('latitude', venue.latitude ?? undefined);
      setValue('longitude', venue.longitude ?? undefined);
    }
    if (venueTags) {
      setSelectedTags(venueTags.map(vt => vt.tag.id));
    }
  }, [venue, venueTags, setValue]);

  const onSubmit = async (data: EditVenueForm) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title.trim());
      if (data.description) formData.append('description', data.description.trim());
      if (data.schedule) formData.append('schedule', data.schedule.trim());
      formData.append('average_check', data.average_check.toString());
      formData.append('category', data.category);
      formData.append('street', data.street.trim());
      formData.append('city', data.city.trim());
      if (data.region) formData.append('region', data.region.trim());
      if (data.country) formData.append('country', data.country.trim());
      formData.append('house', data.house.toString());
      if (data.latitude !== undefined && data.latitude !== null) formData.append('latitude', data.latitude.toString());
      if (data.longitude !== undefined && data.longitude !== null) formData.append('longitude', data.longitude.toString());
      if (photo) formData.append('photo', photo);

      await updateVenue({ id: venueIdNum, data: formData }).unwrap();

      // Sync tags
      const currentTagIds = venueTags.map(vt => vt.tag.id);
      const toAdd = selectedTags.filter(id => !currentTagIds.includes(id));
      for (const tagId of toAdd) {
        await addTagToVenue({ venueId: venueIdNum, tag_id: tagId });
      }

      reset();
      setPhoto(null);
      navigate('/profile/my-venues');
    } catch (error: any) {
      alert(`Не вдалось оновити: ${error.data?.detail || 'Спробуйте ще раз'}`);
    }
  };

  const toggleTag = (tagId: number) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  if (!venue) return <div className="text-center py-12">Завантаження...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">Редагувати заклад</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Назва *</label>
              <input {...register('title')} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title.message as string}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Категорія *</label>
              <select {...register('category')} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Оберіть категорію</option>
                <option value="cafe">Кафе</option>
                <option value="restaurant">Ресторан</option>
                <option value="bar">Бар</option>
                <option value="mixed">Різне</option>
              </select>
              {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category.message as string}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Опис закладу</label>
            <textarea {...register('description')} rows={4} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message as string}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Середній чек (₴) *</label>
              <input type="number" {...register('average_check')} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {errors.average_check && <p className="text-red-600 text-sm mt-1">{errors.average_check.message as string}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Графік</label>
              <input {...register('schedule')} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Mon-Sun 10:00-22:00" />
              {errors.schedule && <p className="text-red-600 text-sm mt-1">{errors.schedule.message as string}</p>}
            </div>
          </div>

          {/* Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Вулиця *</label>
              <input {...register('street')} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {errors.street && <p className="text-red-600 text-sm mt-1">{errors.street.message as string}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Будинок *</label>
              <input type="number" {...register('house')} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {errors.house && <p className="text-red-600 text-sm mt-1">{errors.house.message as string}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Місто *</label>
              <input {...register('city')} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city.message as string}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Регіон</label>
              <input {...register('region')} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {errors.region && <p className="text-red-600 text-sm mt-1">{errors.region.message as string}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Країна</label>
              <input {...register('country')} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {errors.country && <p className="text-red-600 text-sm mt-1">{errors.country.message as string}</p>}
            </div>
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Широта (Latitude)</label>
              <input type="number" step="any" {...register('latitude')} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 50.4501" />
              {errors.latitude && <p className="text-red-600 text-sm mt-1">{errors.latitude.message as string}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Довгота (Longitude)</label>
              <input type="number" step="any" {...register('longitude')} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 30.5234" />
              {errors.longitude && <p className="text-red-600 text-sm mt-1">{errors.longitude.message as string}</p>}
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Фото закладу (опціонально)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {photo && <p className="text-sm text-gray-500 mt-1">Обрано: {photo.name}</p>}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-bold mb-4 text-gray-700">Теги</label>
            {tagsLoading ? (
              <p className="text-gray-500">Завантаження тегів...</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {allTags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`px-4 py-2 rounded-full border font-medium transition ${
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
              Оновити заклад
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVenuePage;