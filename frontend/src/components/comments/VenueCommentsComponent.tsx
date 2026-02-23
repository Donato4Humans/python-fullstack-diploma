
import { useGetVenueCommentsQuery } from '../../redux/api/commentApi';
import VenueCommentComponent from './VenueCommentComponent';
import {useSearchParams} from "react-router-dom";
import PaginationComponent from "../common/PaginationComponent.tsx";

interface VenueCommentsComponentProps {
  venueId: number;
}

const PAGE_SIZE = 1;

const VenueCommentsComponent = ({ venueId }: VenueCommentsComponentProps) => {
  const { data: comments = [], isLoading, isError } = useGetVenueCommentsQuery(venueId);

  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('comments_page')) || 1;
  const totalPages = Math.ceil((comments.length || 0) / PAGE_SIZE);
  const paginatedComments = comments.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  if (isLoading) {
    return <div className="text-center py-8 text-gray-600">Завантажуємо коментарі...</div>;
  }

  if (isError) {
    return <div className="text-center py-8 text-red-600">Помилка завантаження коментарів</div>;
  }

  return (
    <div className="space-y-10">
      <h2 className="text-3xl font-bold text-gray-900 text-center">
        Коментарі відвідувачів
      </h2>

      {comments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
          <p className="text-gray-500 text-xl">
            Ще немає коментарів до цього закладу
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {paginatedComments.map((comment) => (
              <VenueCommentComponent key={comment.id} comment={comment} />
            ))}
          </div>

          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            paramName={'comments_page'}
          />
        </>
      )}
    </div>
  );
};

export default VenueCommentsComponent;