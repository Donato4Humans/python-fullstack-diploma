import { useState } from 'react';
import { useGetTagsQuery, useCreateTagMutation, useDeleteTagMutation } from '../../redux/api/tagApi';
import { useSearchParams } from "react-router-dom";
import { useForm } from 'react-hook-form';
import PaginationComponent from "../../components/common/PaginationComponent.tsx";

const PAGE_SIZE = 2;

const AdminTagsManagement = () => {
  const { data: tags = [], isLoading } = useGetTagsQuery(undefined);
  const [createTag] = useCreateTagMutation();
  const [deleteTag] = useDeleteTagMutation();

  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const totalPages = Math.ceil((tags.length || 0) / PAGE_SIZE);
  const paginatedTags = tags.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const { register, handleSubmit, reset, setFocus } = useForm<{ name: string }>();

  const [errorMessage, setErrorMessage] = useState<string>('');

  const onCreate = async (data: { name: string }) => {
    const tagName = data.name.trim().toLowerCase();

    const tagExists = tags.some(tag => tag.name.toLowerCase() === tagName);

    if (tagExists) {
      setErrorMessage('Тег з такою назвою вже існує');
      setFocus('name');
      return;
    }

    try {
      await createTag({ name: tagName });
      reset();
      setErrorMessage('');
    } catch (error: any) {
      setErrorMessage(error?.data?.name?.[0] || 'Не вдалося створити тег');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Видалити тег?')) {
      await deleteTag(id);
    }
  };

  const handleInputChange = () => {
    if (errorMessage) setErrorMessage('');
  };

  if (isLoading) return <p>Завантаження тегів...</p>;

  return (
    <div className="space-y-10">
      <h2 className="text-3xl font-bold text-gray-900">Керування тегами ({tags.length})</h2>

      {/* Create Form */}
      <form onSubmit={handleSubmit(onCreate)} className="mb-8 p-6 bg-white rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-4">Додати новий тег</h3>

        <div className="flex gap-4">
          <input
            {...register('name', { required: true })}
            onChange={handleInputChange}
            placeholder="Назва тегу (наприклад: wi-fi)"
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Додати
          </button>
        </div>

        {errorMessage && (
          <p className="mt-3 text-red-600 text-sm font-medium">{errorMessage}</p>
        )}
      </form>

      {/* Tags List */}
      <div className="space-y-4">
        {paginatedTags.map((tag) => (
          <div key={tag.id} className="bg-white p-6 rounded-xl shadow flex justify-between items-center">
            <span className="font-medium">{tag.name}</span>
            <button
              onClick={() => handleDelete(tag.id)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
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

export default AdminTagsManagement;