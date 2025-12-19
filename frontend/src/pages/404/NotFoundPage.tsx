
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-gray-50">
      <div className="mb-4 select-none text-7xl">🚫</div>
      <h1 className="mb-2 text-4xl font-bold text-gray-900">
        Page Not Found
      </h1>
      <p className="mb-6 text-lg text-gray-600 max-w-md">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="inline-block px-6 py-2 font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;