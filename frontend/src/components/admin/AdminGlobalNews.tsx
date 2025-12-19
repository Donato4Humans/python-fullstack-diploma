
import { useGetGlobalNewsQuery, useCreateNewsMutation, useDeleteNewsMutation } from '../../redux/api/newsApi';

const AdminGlobalNews = () => {
  const { data: news = [], isLoading } = useGetGlobalNewsQuery();
  const [createNews] = useCreateNewsMutation();
  const [deleteNews] = useDeleteNewsMutation();

  // Simple create form
  const handleCreate = async () => {
    const title = prompt('News title');
    const content = prompt('News content');
    if (title && content) {
      await createNews({ title, content, venue: null });
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete news?')) {
      await deleteNews(id);
    }
  };

  if (isLoading) return <p>Loading global news...</p>;

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Global News ({news.length})</h2>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Add Global News
        </button>
      </div>
      <div className="space-y-4">
        {news.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-xl shadow flex justify-between">
            <div>
              <h3 className="font-bold">{item.title}</h3>
              <p className="text-gray-600">{item.content.substring(0, 100)}...</p>
            </div>
            <button
              onClick={() => handleDelete(item.id)}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminGlobalNews;