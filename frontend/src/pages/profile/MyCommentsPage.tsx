
import { useGetMyCommentsQuery } from '../../redux/api/commentApi';
import VenueCommentComponent from '../../components/comments/VenueCommentComponent';

const MyCommentsPage = () => {
  const { data: comments = [], isLoading } = useGetMyCommentsQuery();

  if (isLoading) {
    return <div className="text-center py-20 text-gray-600">Loading comments...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Comments</h1>
      <div className="space-y-6">
        {comments.map((comment) => (
          <VenueCommentComponent key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default MyCommentsPage;