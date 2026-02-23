import { useGetForbiddenWordsQuery, useCreateForbiddenWordMutation, useDeleteForbiddenWordMutation } from '../../redux/api/forbiddenWordsApi';
import { useSearchParams } from "react-router-dom";
import { useForm } from 'react-hook-form';
import PaginationComponent from "../../components/common/PaginationComponent.tsx";

const PAGE_SIZE = 1;

const AdminForbiddenWords = () => {
  const { data: words = [], isLoading } = useGetForbiddenWordsQuery();
  const [createWord] = useCreateForbiddenWordMutation();
  const [deleteWord] = useDeleteForbiddenWordMutation();

  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const totalPages = Math.ceil((words.length || 0) / PAGE_SIZE);
  const paginatedWords = words.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const { register, handleSubmit, reset } = useForm<{ word: string }>();

  const onCreate = async (data: { word: string }) => {
    await createWord({ word: data.word.toLowerCase() });
    reset();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Видалити слово?')) {
      await deleteWord(id);
    }
  };

  if (isLoading) return <p>Завантаження забороненої лексики...</p>;

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-bold mb-6">
        Заборонена лексика ({words.length})
      </h2>

      {/* Create */}
      <form onSubmit={handleSubmit(onCreate)} className="mb-8 p-6 bg-white rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-4">Додати слово</h3>
        <div className="flex gap-4">
          <input
            {...register('word', { required: true })}
            placeholder="Заборонене слово"
            className="flex-1 p-3 border rounded-lg"
          />
          <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg">
            Додати
          </button>
        </div>
      </form>

      {/* List */}
      <div className="space-y-4">
        {paginatedWords.map((word) => (
          <div key={word.id} className="bg-white p-6 rounded-xl shadow flex justify-between items-center">
            <span className="font-medium">{word.word}</span>
            <button
              onClick={() => handleDelete(word.id)}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Видалити
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pt-10 flex justify-center">
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

export default AdminForbiddenWords;