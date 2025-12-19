
import { useGetForbiddenWordsQuery, useCreateForbiddenWordMutation, useDeleteForbiddenWordMutation } from '../../redux/api/forbiddenWordsApi';
import { useForm } from 'react-hook-form';

const AdminForbiddenWords = () => {
  const { data: words = [], isLoading } = useGetForbiddenWordsQuery();
  const [createWord] = useCreateForbiddenWordMutation();
  // const [updateWord] = useUpdateForbiddenWordMutation();
  const [deleteWord] = useDeleteForbiddenWordMutation();

  const { register, handleSubmit, reset } = useForm<{ word: string }>();

  const onCreate = async (data: { word: string }) => {
    await createWord({ word: data.word.toLowerCase() });
    reset();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete word?')) {
      await deleteWord(id);
    }
  };

  if (isLoading) return <p>Loading forbidden words...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Forbidden Words ({words.length})</h2>

      {/* Create */}
      <form onSubmit={handleSubmit(onCreate)} className="mb-8 p-6 bg-white rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-4">Add Word</h3>
        <div className="flex gap-4">
          <input
            {...register('word', { required: true })}
            placeholder="Bad word"
            className="flex-1 p-3 border rounded-lg"
          />
          <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg">
            Add
          </button>
        </div>
      </form>

      {/* List */}
      <div className="space-y-4">
        {words.map((word) => (
          <div key={word.id} className="bg-white p-6 rounded-xl shadow flex justify-between items-center">
            <span className="font-medium">{word.word}</span>
            <button
              onClick={() => handleDelete(word.id)}
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

export default AdminForbiddenWords;