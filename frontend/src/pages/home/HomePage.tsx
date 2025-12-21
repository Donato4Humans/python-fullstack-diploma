
import { Link } from 'react-router-dom';
import SearchComponent from '../../components/search/SearchComponent';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Hero section with search — main focus */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Вітаємо на Piyachok!
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12">
            Знайдіть ідеальний заклад для зустрічей, відпочинку або роботи
          </p>

          {/* Search Component  */}
          <div className="max-w-5xl mx-auto">
            <SearchComponent />
          </div>
        </div>

        {/* Big button to all venues */}
        <div className="text-center mb-20">
          <Link
            to="/venues"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-2xl py-6 px-16 rounded-2xl shadow-2xl transition transform hover:scale-105"
          >
            Подивитись всі заклади
          </Link>
        </div>

        {/* News section */}
        <div className="bg-gray-50 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Загальні новини
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Останні новини від закладів та суспільства
          </p>
          <Link
            to="/news-general"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold text-xl py-5 px-12 rounded-xl shadow-lg transition transform hover:scale-105"
          >
            Подивитись всі новини
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;