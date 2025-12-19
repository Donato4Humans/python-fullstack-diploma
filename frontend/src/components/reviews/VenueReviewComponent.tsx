
import { StarIcon } from '@heroicons/react/24/solid';
import {IReview} from "../../models/IReview";


const VenueReviewComponent = ({ review }: { review: IReview }) => {
  const { author_name, rating, text, is_critic_review } = review;

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">{author_name}</span>
          {is_critic_review && (
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
              Critic
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon
              key={i}
              className={`w-5 h-5 ${
                i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-sm text-gray-600 ml-1">{rating}</span>
        </div>
      </div>

      {text ? (
        <p className="text-gray-700 leading-relaxed">{text}</p>
      ) : (
        <p className="text-gray-500 italic text-sm">No detailed text — just rating</p>
      )}
    </div>
  );
};

export default VenueReviewComponent;