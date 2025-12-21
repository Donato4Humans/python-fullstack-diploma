import type { IComment } from "../../models/IComment";
import {useGetVenueQuery} from "../../redux/api/venueApi.ts";

const VenueCommentComponent = ({ comment }: { comment: IComment }) => {
  const { author_name, text, is_moderated, created_at, venue_id } = comment;
  const {data : venue} = useGetVenueQuery(venue_id);

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <span className="font-semibold text-gray-900">{author_name}</span>
        <span className="text-sm text-gray-500">
          {new Date(created_at).toLocaleDateString('uk-UA')}
        </span>
      </div>

      {/* Venue Title */}
      {venue && (
        <p className="text-lg font-semibold text-gray-800 mb-3">
          Коментар до закладу: <span className="text-blue-600">{venue.title}</span>
        </p>
      )}

      <p className="text-gray-700 leading-relaxed">{text}</p>
      {!is_moderated && (
        <p className="text-xs text-red-500 mt-4 italic">На модерації</p>
      )}
    </div>
  );
};

export default VenueCommentComponent;