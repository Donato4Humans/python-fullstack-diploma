
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { useGetTagsQuery } from '../../redux/api/tagApi';

const categoryOptions = [
  { value: '', label: 'Всі категорії' },
  { value: 'cafe', label: 'Кафе' },
  { value: 'restaurant', label: 'Ресторан' },
  { value: 'bar', label: 'Бар' },
  { value: 'mixed', label: 'Змішаний' },
];

const sortOptions = [
  { value: 'rating', label: 'За рейтингом' },
  { value: 'average_check', label: 'Від дешевих' },
  { value: '-average_check', label: 'Від дорогих' },
  { value: 'newest', label: 'Нові спочатку' },
  { value: 'views', label: 'Найпопулярніші' },
  { value: 'distance', label: 'Найближчі спочатку' },
];

const SearchComponent = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [minRating, setMinRating] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('rating');

  // Load tags from backend
  const { data: tags = [], isLoading: tagsLoading } = useGetTagsQuery(undefined);

  const tagOptions = tags.map(tag => ({
    value: tag.name,
    label: tag.name.charAt(0).toUpperCase() + tag.name.slice(1),  // capitalize
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (query.trim()) params.set('q', query.trim());
    if (category) params.set('category', category);
    if (minRating) params.set('min_rating', minRating);
    if (minPrice) params.set('min_price', minPrice);
    if (maxPrice) params.set('max_price', maxPrice);
    selectedTags.forEach(tag => params.append('tag', tag));
    if (sortBy) params.set('order_by', sortBy);
    if (sortBy === 'distance') {
      params.set('sort', 'distance');
    } else {
      params.delete('sort');
    }

    navigate(`/venues?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Пошук закладів
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Text search */}
        <div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Назва, опис, теги (наприклад: wifi terrace)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category + Sorting */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Категорія
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categoryOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Сортувати за
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Rating and Price */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Мін. рейтинг
            </label>
            <input
              type="number"
              min="0"
              max="5"
              step="0.5"
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              placeholder="наприклад: 4.5"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Мін. ціна
            </label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="від"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Макс. ціна
            </label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="до"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Tags — loaded from backend */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Теги
          </label>
          {tagsLoading ? (
            <p className="text-gray-500">Завантаження тегів...</p>
          ) : (
            <Select
              isMulti
              options={tagOptions}
              onChange={(selected) => setSelectedTags(selected.map(s => s.value))}
              placeholder="Оберіть теги..."
              noOptionsMessage={() => "Теги не знайдено"}
              className="basic-multi-select"
              classNamePrefix="select"
            />
          )}
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl py-4 px-12 rounded-xl transition transform hover:scale-105"
          >
            Шукати заклади
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchComponent;