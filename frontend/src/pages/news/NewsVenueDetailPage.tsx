
import { useParams } from 'react-router-dom';
import { useGetNewsQuery } from '../../redux/api/newsApi';

const NewsVenueDetailPage = () => {
  const { newsId } = useParams<{ newsId: string }>();
  const newsIdNum = Number(newsId);

  const { data: news, isLoading, isError } = useGetNewsQuery(newsIdNum);

  if (isLoading) {
    return <div className="text-center py-20 text-gray-600">Loading...</div>;
  }

  if (isError || !news) {
    return <div className="text-center py-20 text-red-600">News not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <article className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{news.title}</h1>
          {news.photo && (
            <img
              src={news.photo}
              alt={news.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}
          <p className="text-lg text-gray-700 leading-relaxed mb-6">{news.content}</p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{new Date(news.created_at).toLocaleDateString('uk-UA')}</span>
            {news.venue && <span>Venue: {news.venue.title}</span>}
          </div>
        </article>
      </div>
    </div>
  );
};

export default NewsVenueDetailPage;