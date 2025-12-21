
import { useGetTagsQuery, useCreateTagMutation,  useDeleteTagMutation } from '../../redux/api/tagApi';
import { useForm } from 'react-hook-form';

const AdminTagsManagement = () => {
  const { data: tags = [], isLoading } = useGetTagsQuery(undefined);
  const [createTag] = useCreateTagMutation();
  // const [updateTag] = useUpdateTagMutation();
  const [deleteTag] = useDeleteTagMutation();

  const { register, handleSubmit, reset } = useForm<{ name: string }>();

  const onCreate = async (data: { name: string }) => {
    await createTag({ name: data.name.toLowerCase() });
    reset();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Видалити тег?')) {
      await deleteTag(id);
    }
  };

  if (isLoading) return <p>Завантаження тегів...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Керування тегами</h2>

      {/* Create form */}
      <form onSubmit={handleSubmit(onCreate)} className="mb-8 p-6 bg-white rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-4">Додати новий тег</h3>
        <div className="flex gap-4">
          <input
            {...register('name', { required: true })}
            placeholder="Назва тегу (наприклад wi-fi)"
            className="flex-1 p-3 border rounded-lg"
          />
          <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg">
            Додати
          </button>
        </div>
      </form>

      {/* List */}
      <div className="space-y-4">
        {tags.map((tag) => (
          <div key={tag.id} className="bg-white p-6 rounded-xl shadow flex justify-between items-center">
            <span className="font-medium">{tag.name}</span>
            <button
              onClick={() => handleDelete(tag.id)}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Видалити
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTagsManagement;