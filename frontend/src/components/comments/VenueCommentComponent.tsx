
import { IUser, IComment } from '../../types';

const VenueCommentComponent = ({ comment }: { comment: IComment }) => {
  const { author_name, text, is_moderated, created_at } = comment;

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <span className="font-semibold text-gray-900">{author_name}</span>
        <span className="text-sm text-gray-500">
          {new Date(created_at).toLocaleDateString('uk-UA')}
        </span>
      </div>
      <p className="text-gray-700 leading-relaxed">{text}</p>
      {!is_moderated && (
        <p className="text-xs text-red-500 mt-2 italic">Under moderation</p>
      )}
    </div>
  );
};

export default VenueCommentComponent;