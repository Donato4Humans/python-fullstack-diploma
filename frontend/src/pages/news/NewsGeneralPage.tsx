
import { useGetGlobalNewsQuery } from '../../redux/api/newsApi';
import GeneralNewsComponent from '../../components/news/GeneralNewsComponent';

const NewsGeneralPage = () => {
  const { data: news, isLoading, isError } = useGetGlobalNewsQuery();

  if (isLoading) {
    return <div className="text-center py-20 text-gray-600">Loading global news...</div>;
  }

  if (isError) {
    return <div className="text-center py-20 text-red-600">Error loading global news</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Global News
        </h1>
        <GeneralNewsComponent news={news || []} />
      </div>
    </div>
  );
};

export default NewsGeneralPage;