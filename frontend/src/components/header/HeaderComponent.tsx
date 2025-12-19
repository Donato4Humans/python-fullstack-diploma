import { Link } from 'react-router-dom';

const HeaderComponent = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold text-blue-600">
          PiyachokAPP
        </Link>

        <nav className="flex gap-8 text-lg font-medium">
          <Link to="/" className="text-gray-700 hover:text-blue-600">
            Головна
          </Link>
          <Link to="/top" className="text-gray-700 hover:text-blue-600">
            Топ
          </Link>
          <Link to="/piyachok" className="text-gray-700 hover:text-blue-600">
            Пиячок
          </Link>
          <Link to="/profile" className="text-gray-700 hover:text-blue-600">
            Профіль
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default HeaderComponent;