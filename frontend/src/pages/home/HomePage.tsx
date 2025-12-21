// HomePage.tsx
import { Link } from 'react-router-dom';
import SearchComponent from '../../components/search/SearchComponent';
import { useEffect, useState } from 'react';

const HomePage = () => {
  const [showAgeWarning, setShowAgeWarning] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem('ageWarningAccepted');
    if (!hasAccepted) {
      setShowAgeWarning(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('ageWarningAccepted', 'true');
    setShowAgeWarning(false);
  };

  return (
    <>
      {showAgeWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Важливе попередження
            </h2>
            <p className="text-lg text-gray-700 mb-6 text-center">
              Запускаючи цей додаток, ви підтверджуєте, що вам є 18 років або більше. Сайт містить контент для дорослих.
            </p>
            <button
              onClick={handleAccept}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition text-lg"
            >
              Підтверджую, мені 18+
            </button>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-16 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 md:mb-24">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Вітаємо на Piyachok!
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-700 max-w-4xl mx-auto mb-12 leading-relaxed">
              Знайдіть ідеальні місця для відпочинку, зустрічей з друзями чи роботи — від затишних кафе до стильних барів і ресторанів
            </p>

            {/* Search */}
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
              <SearchComponent />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {/* All Venues */}
            <Link
              to="/venues"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl shadow-xl overflow-hidden transform hover:scale-105 hover:shadow-2xl transition-all duration-300"
            >
              <div className="p-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Всі заклади</h2>
                <p className="text-lg md:text-xl opacity-90 mb-6">
                  Відкрийте для себе найкращі місця поруч
                </p>
                <span className="inline-block bg-white text-blue-600 font-semibold py-3 px-8 rounded-full text-lg">
                  Переглянути
                </span>
              </div>
            </Link>

            {/* News */}
            <Link
              to="/news-general"
              className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-3xl shadow-xl overflow-hidden transform hover:scale-105 hover:shadow-2xl transition-all duration-300"
            >
              <div className="p-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Загальні новини</h2>
                <p className="text-lg md:text-xl opacity-90 mb-6">
                  Останні події та промо від закладів
                </p>
                <span className="inline-block bg-white text-green-600 font-semibold py-3 px-8 rounded-full text-lg">
                  Читати новини
                </span>
              </div>
            </Link>
          </div>

          {/* Vibe */}
          <div className="text-center py-12">
            <p className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
              З Piyachok ваш відпочинок стає незабутнім
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Шукайте місця з тегами wi-fi, тераса, жива музика чи затишні вечори — усе для комфортного відпочинку
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;