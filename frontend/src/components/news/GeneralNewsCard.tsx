
import { Link } from 'react-router-dom';
import type {INews} from "../../models/INews";

const GeneralNewsCard = ({ news }: { news: INews }) => {
  return (
    <Link to={`/news-general/${news.id}`} className="block">
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-xl transition-shadow duration-300">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{news.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{news.content}</p>
        {news.photo && (
          <img
            src={news.photo}
            alt={news.title}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        )}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{new Date(news.created_at).toLocaleDateString('en-US')}</span>
          {news.is_paid && <span className="text-yellow-600 font-medium">Sponsored</span>}
        </div>
      </div>
    </Link>
  );
};

export default GeneralNewsCard;