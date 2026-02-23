import { useGetBlockedCommentsQuery, useUpdateCommentMutation, useDeleteCommentMutation } from '../../redux/api/commentApi';
import { useSearchParams } from "react-router-dom";
import PaginationComponent from "../../components/common/PaginationComponent.tsx";

const PAGE_SIZE = 1;

const AdminBlockedComments = () => {
  const { data: comments = [], isLoading } = useGetBlockedCommentsQuery();
  const [updateComment] = useUpdateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const totalPages = Math.ceil((comments.length || 0) / PAGE_SIZE);
  const paginatedComments = comments.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleApprove = async (id: number) => {
    await updateComment({ id, text: '' });
  };

  const handleDelete = async (id: number) => {
    await deleteComment(id);
  };

  if (isLoading) return <p>Завантаження заблокованих коментарів...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        Заблоковані коментарі ({comments.length})
      </h2>

      <div className="space-y-4">
        {paginatedComments.map((comment) => (
          <div key={comment.id} className="bg-white p-6 rounded-xl shadow border">
            <p className="font-semibold">{comment.author_name}</p>
            <p className="text-gray-700 mb-4">{comment.text}</p>
            <div className="space-x-4">
              <button
                onClick={() => handleApprove(comment.id)}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Схвалити
              </button>
              <button
                onClick={() => handleDelete(comment.id)}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Видалити
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination  */}
      <div className="pt-10 flex justify-center">
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

export default AdminBlockedComments;