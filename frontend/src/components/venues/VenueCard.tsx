
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
import {useGetVenueTagsQuery} from "../../redux/api/tagApi.ts";
import {useGetVenueOwnerQuery} from "../../redux/api/venueOwnerApi.ts";
import VenueReviewsComponent from "../reviews/VenueReviewsComponent.tsx";
import VenueCommentsComponent from "../comments/VenueCommentsComponent.tsx";

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
  const {data : venue_tags = []} = useGetVenueTagsQuery(venue.id)
  const {data : venue_owner} = useGetVenueOwnerQuery(venue.owner)

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
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group relative w-full max-w-sm mx-auto">
        {/* Photo */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={venue.photo || '/venue_placeholder.png'}
            alt={venue.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {user && (
            <button
              onClick={handleFavorite}
              className="absolute top-4 right-4 p-3 bg-white/90 rounded-full shadow-md hover:bg-white transition z-10"
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
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-3">{venue.title}</h3>
          <p className="text-sm text-gray-600 mb-2">Тип закладу: {venue.category}</p>
          <p className="text-lg font-semibold text-green-600 mb-4">
            Середній чек: {venue.average_check} ₴
          </p>
          <div className="flex items-center justify-center gap-1 mb-4">
            <StarIcon className="w-6 h-6 text-yellow-400" />
            <span className="text-xl font-semibold">{venue.rating}</span>
          </div>
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {venue_tags?.map((vt: IVenueTag) => (
              <span key={vt.id} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {vt.tag.name}
              </span>
            ))}
          </div>

          {/* Owner buttons  */}
          {isOwnerView && (
            <div className="space-y-3 mt-6">
              <Link
                to={`/profile/create-venue-news/${venue.id}`}
                className="block w-full bg-purple-600 text-white text-center py-3 rounded-lg font-medium hover:bg-purple-700"
              >
                Додати новину/промо
              </Link>
              <Link
                to={`/news-venues/${venue.id}`}
                className="block w-full bg-gray-600 text-white text-center py-3 rounded-lg font-medium hover:bg-gray-700"
              >
                Новини закладу
              </Link>
              <button
                onClick={() => setShowStats(true)}
                className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700"
              >
                Статистика
              </button>
            </div>
          )}

          {/* Normal button */}
          <Link
            to={`/venues/${venue.id}`}
            className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 mt-6"
          >
            Детально про заклад
          </Link>
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
      <div className="relative h-96 overflow-hidden"> {/* Increased height for better proportion */}
        <img
          src={venue.photo || '/venue_placeholder.png'}
          alt={venue.title}
          className="w-full h-full object-cover"
        />
        {user && (
          <button
            onClick={handleFavorite}
            className="absolute top-6 right-6 p-4 bg-white/90 rounded-full shadow-lg hover:bg-white transition z-10"
          >
            {isFavorite ? (
              <HeartSolidIcon className="w-8 h-8 text-red-500" />
            ) : (
              <HeartIcon className="w-8 h-8 text-gray-600" />
            )}
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{venue.title}</h1>
        <p className="text-2xl text-gray-600 mb-4">Тип закладу: {venue.category}</p>
        <div className="flex items-center gap-3 mb-6">
          <StarIcon className="w-8 h-8 text-yellow-400" />
          <span className="text-3xl font-bold">{venue.rating}</span>
          <span className="text-2xl font-semibold text-green-600 ml-4">
            Середній чек: {venue.average_check} ₴
          </span>
        </div>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">Опис закладу: {venue.description}</p>
        <p className="text-base text-gray-500 mb-8">
          Адреса: {venue.street}, {venue.city}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-3 mb-10">
          {venue_tags?.map((vt: IVenueTag) => (
            <span key={vt.id} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-base font-medium">
              {vt.tag.name}
            </span>
          ))}
        </div>

        {/* Buttons Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Piyachok */}
          <button
            onClick={() => navigate(`/piyachok/venue/${venue.id}`)}
            className="bg-purple-600 text-white py-4 rounded-xl font-semibold hover:bg-purple-700 transition text-lg"
          >
            Знайти собі компанію тут
          </button>

          {/* Venue News */}
          <Link
            to={`/news-venues/${venue.id}`}
            className="bg-gray-600 text-white py-4 rounded-xl font-semibold hover:bg-gray-700 transition text-center text-lg"
          >
            Новини закладу
          </Link>
        </div>

        {/* Email to owner */}
        <div className="mb-12">
          <button
            onClick={() => setShowEmailForm(!showEmailForm)}
            className="w-full bg-gray-700 text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition text-lg"
          >
            Написати листа/скаргу власнику
          </button>
          {showEmailForm && (
            <form onSubmit={handleEmailSubmit} className="mt-6 space-y-6">
              <textarea
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                placeholder="Ваше повідомлення..."
                className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500"
                rows={5}
              />
              <button type="submit" className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700">
                Відправити
              </button>
            </form>
          )}
          {emailSent && venue_owner && (
            <p className="mt-6 text-green-700 text-center text-lg font-medium">
              Повідомлення надіслано на {venue_owner.user.email}
            </p>
          )}
        </div>

        {/* Existing Comments */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-6">Існуючі коментарі</h3>
          <VenueCommentsComponent venueId={venue.id} />
        </div>

        {/* Comment form */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-6">Додати коментар</h3>
          <form onSubmit={handleCommentSubmit} className="space-y-6">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Ваш коментар..."
              className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={5}
            />
            <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700">
              Надіслати коментар
            </button>
          </form>
        </div>

        {/* Existing Reviews */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-6">Існуючі відгуки</h3>
          <VenueReviewsComponent venueId={venue.id} />
        </div>

        {/* Review form */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-6">Додати відгук</h3>
          <form onSubmit={handleReviewSubmit} className="space-y-6">
            <div>
              <label className="block text-lg font-medium mb-3">Оцінка</label>
              <select value={reviewRating} onChange={(e) => setReviewRating(Number(e.target.value))} className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500">
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n} ★</option>
                ))}
              </select>
            </div>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Ваш відгук (необов'язково)..."
              className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={5}
            />
            <button type="submit" className="w-full bg-purple-600 text-white py-4 rounded-xl font-semibold hover:bg-purple-700">
              Підтвердити відгук
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VenueCard;