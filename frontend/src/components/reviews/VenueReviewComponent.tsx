import { StarIcon } from '@heroicons/react/24/solid';
import type { IReview } from "../../models/IReview";

const VenueReviewComponent = ({ review }: { review: IReview }) => {
  const { author_name, rating, text, is_critic_review } = review;

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-lg text-gray-900">{author_name}</span>
          {is_critic_review && (
            <span className="bg-yellow-200 text-yellow-900 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide shadow-sm">
              Критик
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon
              key={i}
              className={`w-6 h-6 ${
                i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-base font-medium text-gray-700 ml-2">{rating}/5</span>
        </div>
      </div>

      {text ? (
        <p className="text-gray-800 leading-relaxed text-base">{text}</p>
      ) : (
        <p className="text-gray-500 italic text-sm">Ніякого тексту — тільки оцінка</p>
      )}
    </div>
  );
};

export default VenueReviewComponent;