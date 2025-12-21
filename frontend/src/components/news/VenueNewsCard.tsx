
import { Link, useLocation } from 'react-router-dom';
import { useDeleteNewsMutation } from '../../redux/api/newsApi';
import type {INews} from "../../models/INews";

const VenueNewsCard = ({ news }: { news: INews }) => {
  const location = useLocation();
  const [deleteNews] = useDeleteNewsMutation();

  const isOwnerView = location.pathname.includes('/news-venues/') || location.pathname.includes('/profile/');

  const handleDelete = async () => {
    if (confirm('Delete this news?')) {
      await deleteNews(news.id);
    }
  };

  return (
    <div className="relative bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-xl transition-shadow">
      {isOwnerView && (
        <button
          onClick={handleDelete}
          className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
        >
          Видалити
        </button>
      )}
      <Link to={`/news-general/${news.id}`} className="block">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{news.title}</h3>
        <p className="text-gray-600 mb-4">{news.content.substring(0, 150)}...</p>
        {news.photo && (
          <img src={news.photo || '/news_placeholder'} alt={news.title} className="w-full h-48 object-cover rounded-lg mb-4" />
        )}
        <span className="text-sm text-gray-500">
          {new Date(news.created_at).toLocaleDateString()}
        </span>
      </Link>
    </div>
  );
};

export default VenueNewsCard;