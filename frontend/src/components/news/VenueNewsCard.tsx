
import { Link } from 'react-router-dom';
import {INews} from "../../models/INews";

const VenueNewsCard = ({ news }: { news: INews }) => {
  return (
    <Link to={`/news-venue/venue/${news.id}`} className="block">
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-xl transition-shadow duration-300">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{news.title}</h3>
        <p className="text-gray-600 mb-3">{news.content.substring(0, 150)}...</p>
        {news.photo && (
          <img
            src={news.photo}
            alt={news.title}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        )}
        <div className="flex items-center justify-between">
          <span className="text-sm text-blue-600 font-medium">
            {news.is_paid ? 'Sponsored' : 'Free'}
          </span>
          <span className="text-sm text-gray-500">
            {new Date(news.created_at).toLocaleDateString('uk-UA')}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default VenueNewsCard;