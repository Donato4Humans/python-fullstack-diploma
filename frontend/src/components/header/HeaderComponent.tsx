import { Link } from 'react-router-dom';

export const HeaderComponent = () => {
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <span className="text-4xl font-extrabold text-white tracking-tight">
            Piyachok
          </span>
          <span className="text-2xl font-bold text-indigo-200">APP</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-10">
          <Link
            to="/"
            className="text-white text-lg font-medium hover:text-indigo-200 transition-colors duration-300"
          >
            Головна
          </Link>
          <Link
            to="/top"
            className="text-white text-lg font-medium hover:text-indigo-200 transition-colors duration-300"
          >
            Топ
          </Link>
          <Link
            to="/piyachok"
            className="text-white text-lg font-medium hover:text-indigo-200 transition-colors duration-300"
          >
            Пиячок
          </Link>
          <Link
            to="/profile"
            className="text-white text-lg font-medium hover:text-indigo-200 transition-colors duration-300"
          >
            Профіль
          </Link>
        </nav>

      </div>
    </header>
  );
};

export default HeaderComponent;