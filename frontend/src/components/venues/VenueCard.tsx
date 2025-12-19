
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeartIcon, StarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useAddFavoriteMutation, useGetFavoritesQuery, useRemoveFavoriteMutation } from '../../redux/api/favoritesApi';
import { useAppSelector } from '../../hooks/rtk';
import { useCreateCommentMutation } from '../../redux/api/commentApi';
import type {IVenue} from '../../models/IVenue';
import ViewStatisticComponent from './ViewStatisticComponent';
import type {IVenueTag} from "../../models/ITag";
import {useCreateReviewMutation} from "../../redux/api/reviewApi";

interface VenueCardProps {
  venue: IVenue;
  mode?: 'grid' | 'detail';
  isOwnerView?: boolean; // true in MyVenuesPage
}

const VenueCard = ({ venue, mode = 'grid', isOwnerView = false }: VenueCardProps) => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user.user);
  const { data: favorites = [] } = useGetFavoritesQuery();
  const isFavorite = favorites.some((f) => f.venue_id === venue.id);
  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();

  // Comment & Review
  const [commentText, setCommentText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [createComment] = useCreateCommentMutation();
  const [createReview] = useCreateReviewMutation();

  // Email form (stub)
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailMessage, setEmailMessage] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  // Stats modal
  const [showStats, setShowStats] = useState(false);

  const handleFavorite = async () => {
    if (!user) return;
    if (isFavorite) {
      await removeFavorite(venue.id);
    } else {
      await addFavorite({ venue_id: venue.id });
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    await createComment({ venueId: venue.id, text: commentText });
    setCommentText('');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createReview({ venueId: venue.id, data: { rating: reviewRating, text: reviewText } });
    setReviewText('');
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailSent(true);
    setEmailMessage('');
    setTimeout(() => setEmailSent(false), 5000);
  };

  if (mode === 'grid') {
    return (
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group relative">
        {/* Photo */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={venue.photo || '/placeholder.jpg'}
            alt={venue.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {user && (
            <button
              onClick={handleFavorite}
              className="absolute top-4 right-4 p-2 bg-white/80 rounded-full shadow-md hover:bg-white transition"
            >
              {isFavorite ? (
                <HeartSolidIcon className="w-6 h-6 text-red-500" />
              ) : (
                <HeartIcon className="w-6 h-6 text-gray-600" />
              )}
            </button>
          )}
        </div>

        {/* Info */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{venue.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{venue.category}</p>
          <p className="text-lg font-semibold text-green-600 mb-3">
            {venue.average_check} ₴
          </p>
          <div className="flex items-center justify-center gap-1 mb-3">
            <StarIcon className="w-5 h-5 text-yellow-400" />
            <span className="text-lg font-semibold">{venue.rating}</span>
          </div>
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {venue.venue_tags?.map((vt: IVenueTag) => (
              <span key={vt.tag_id} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {vt.tag.name}
              </span>
            ))}
          </div>

          {/* Owner buttons */}
          {isOwnerView && (
            <div className="space-y-2 mt-4">
              <Link
                to={`/profile/create-venue-news/${venue.id}`}
                className="block w-full bg-purple-600 text-white text-center py-2 rounded-lg font-medium hover:bg-purple-700"
              >
                Add News/Promo
              </Link>
              <Link
                to={`/news-venues/${venue.id}`}
                className="block w-full bg-gray-600 text-white text-center py-2 rounded-lg font-medium hover:bg-gray-700"
              >
                Manage News
              </Link>
              <button
                onClick={() => setShowStats(true)}
                className="w-full bg-teal-600 text-white py-2 rounded-lg font-medium hover:bg-teal-700"
              >
                View Statistics
              </button>
            </div>
          )}

          {/* Normal button */}
          {!isOwnerView && (
            <Link
              to={`/venues/${venue.id}`}
              className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              View details
            </Link>
          )}
        </div>

        {/* Stats modal */}
        {showStats && <ViewStatisticComponent venue={venue} onClose={() => setShowStats(false)} />}
      </div>
    );
  }

  // Detail mode
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Photo */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={venue.photo || '/placeholder.jpg'}
          alt={venue.title}
          className="w-full h-full object-cover"
        />
        {user && (
          <button
            onClick={handleFavorite}
            className="absolute top-4 right-4 p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition"
          >
            {isFavorite ? (
              <HeartSolidIcon className="w-7 h-7 text-red-500" />
            ) : (
              <HeartIcon className="w-7 h-7 text-gray-600" />
            )}
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{venue.title}</h1>
        <p className="text-xl text-gray-600 mb-2">{venue.category}</p>
        <div className="flex items-center gap-2 mb-4">
          <StarIcon className="w-6 h-6 text-yellow-400" />
          <span className="text-2xl font-bold">{venue.rating}</span>
          <span className="text-lg font-semibold text-green-600">
            {venue.average_check} ₴
          </span>
        </div>
        <p className="text-gray-700 mb-4">{venue.description}</p>
        <p className="text-sm text-gray-500 mb-6">
          {venue.street}, {venue.city}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {venue.venue_tags?.map((vt: IVenueTag) => (
            <span key={vt.tag_id} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {vt.tag.name}
            </span>
          ))}
        </div>

        {/* Piyachok button */}
        <div className="p-4 bg-blue-50 rounded-lg mb-8">
          <button
            onClick={() => navigate(`/piyachok/venue/${venue.id}`)}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700"
          >
            Find company here
          </button>
        </div>

        {/* Email to owner */}
        <div className="mb-8">
          <button
            onClick={() => setShowEmailForm(!showEmailForm)}
            className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700"
          >
            Send message to owner
          </button>
          {showEmailForm && (
            <form onSubmit={handleEmailSubmit} className="mt-4 space-y-4">
              <textarea
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                placeholder="Your message..."
                className="w-full p-3 border rounded-lg"
                rows={4}
              />
              <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg">
                Send
              </button>
            </form>
          )}
          {emailSent && (
            <p className="mt-4 text-green-600 text-center">
              Message sent to {venue.owner.user.email}
            </p>
          )}
        </div>

        {/* Comment form */}
        <div className="mb-12">
          <h3 className="text-xl font-bold mb-4">Add Comment</h3>
          <form onSubmit={handleCommentSubmit} className="space-y-4">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Your comment..."
              className="w-full p-3 border rounded-lg"
              rows={4}
            />
            <button type="submit" className="bg-blue-600 text-white py-3 px-6 rounded-lg">
              Send Comment
            </button>
          </form>
        </div>

        {/* Review form */}
        <div className="mb-12">
          <h3 className="text-xl font-bold mb-4">Add Review</h3>
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <select value={reviewRating} onChange={(e) => setReviewRating(Number(e.target.value))} className="w-full p-3 border rounded-lg">
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n} stars</option>
                ))}
              </select>
            </div>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Your review (optional)..."
              className="w-full p-3 border rounded-lg"
              rows={4}
            />
            <button type="submit" className="bg-purple-600 text-white py-3 px-6 rounded-lg">
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VenueCard;