
import { useGetVenueCommentsQuery } from '../../redux/api/commentApi';
import VenueCommentComponent from './VenueCommentComponent';

interface VenueCommentsComponentProps {
  venueId: number;
}

const VenueCommentsComponent = ({ venueId }: VenueCommentsComponentProps) => {
  const { data: comments = [], isLoading, isError } = useGetVenueCommentsQuery(venueId);

  if (isLoading) {
    return <div className="text-center py-8 text-gray-600">Loading comments...</div>;
  }

  if (isError) {
    return <div className="text-center py-8 text-red-600">Error loading comments</div>;
  }

  if (comments.length === 0) {
    return <div className="text-center py-8 text-gray-600">No comments yet</div>;
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <VenueCommentComponent key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default VenueCommentsComponent;