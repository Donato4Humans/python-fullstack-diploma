import { useGetMyCommentsQuery } from '../../redux/api/commentApi';
import VenueCommentComponent from '../../components/comments/VenueCommentComponent';
import { useSearchParams } from "react-router-dom";
import PaginationComponent from "../../components/common/PaginationComponent.tsx";

const PAGE_SIZE = 1;

const MyCommentsPage = () => {
  const { data: comments = [], isLoading } = useGetMyCommentsQuery();

  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const totalPages = Math.ceil((comments.length || 0) / PAGE_SIZE);
  const paginatedComments = comments.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  if (isLoading) {
    return <div className="text-center py-20 text-gray-600">Завантаження коментарів...</div>;
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Мої коментарі</h1>
        <p className="text-gray-600 mt-2">
          Усі коментарі, які ви залишили на сторінках закладів
        </p>
      </div>

      {comments.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
          <p className="text-gray-500 text-xl mb-6">Ви ще не залишили жодного коментаря</p>
          <a
            href="/venues"
            className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-blue-700 transition"
          >
            Переглянути заклади та залишити коментар
          </a>
        </div>
      ) : (
        <>
          <div className="space-y-8">
            {paginatedComments.map((comment) => (
              <VenueCommentComponent key={comment.id} comment={comment} />
            ))}
          </div>

          <div className="pt-8">
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default MyCommentsPage;