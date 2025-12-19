
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeartIcon, StarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useAddFavoriteMutation, useGetFavoritesQuery, useRemoveFavoriteMutation } from '../../redux/api/favoritesApi';
import { useAppSelector } from '../../hooks/rtk';
import VenueReviewsComponent from '../reviews/VenueReviewsComponent';
import VenueCommentsComponent from '../comments/VenueCommentsComponent';
import VenueNewsComponent from '../news/VenueNewsComponent';
import {IVenueTag} from "../../models/ITag";
import {IVenue} from "../../models/IVenue";

interface VenueCardProps {
  venue: IVenue;
  mode?: 'grid' | 'detail'; // default 'grid'
}

const VenueCard = ({ venue, mode = 'grid' }: VenueCardProps) => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user.user);
  const { data: favorites = [] } = useGetFavoritesQuery();
  const isFavorite = favorites.some((f) => f.venue_id === venue.id);
  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();

  const handleFavorite = async () => {
    if (!user) return;
    if (isFavorite) {
      await removeFavorite(venue.id);
    } else {
      await addFavorite({ venue_id: venue.id });
    }
  };

  if (mode === 'grid') {
    return (
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
        {/* Photo */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={venue.photo || '/placeholder.jpg'}
            alt={venue.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Favorite button */}
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

        {/* Basic info */}
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
          <Link
            to={`/venues/${venue.id}`}
            className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            View details
          </Link>
        </div>
      </div>
    );
  }

  // Detail mode — full venue with tabs
  const [activeTab, setActiveTab] = useState<'reviews' | 'comments' | 'news'>('reviews');

  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailMessage, setEmailMessage] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Fake send
      setEmailSent(true);
      setEmailMessage('');
      setTimeout(() => setEmailSent(false), 5000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Photo + favorite — larger */}
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

      {/* Basic info — larger */}
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
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
            <p className="text-sm text-gray-500">
              {venue.street}, {venue.city}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Views: {venue.views}</p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {venue.venue_tags?.map((vt: IVenueTag) => (
            <span key={vt.tag_id} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {vt.tag.name}
            </span>
          ))}
        </div>

        {/* Tabs for related content — hide/show */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-2 px-1 font-medium transition-colors ${
                activeTab === 'reviews'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Reviews
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`py-2 px-1 font-medium transition-colors ${
                activeTab === 'comments'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Comments
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`py-2 px-1 font-medium transition-colors ${
                activeTab === 'news'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              News
            </button>
          </nav>
        </div>

        {/* Tab content — show/hide based on activeTab */}
        <div className="mb-8">
          {activeTab === 'reviews' && <VenueReviewsComponent venueId={venue.id} />}
          {activeTab === 'comments' && <VenueCommentsComponent venueId={venue.id} />}
          {activeTab === 'news' && <VenueNewsComponent venueId={venue.id} />}
        </div>

        {/* Piyachok button — simple navigation */}
        <div className="p-4 bg-blue-50 rounded-lg mb-8">
          <button
            onClick={() => navigate(`/piyachok/venue/${venue.id}`)}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Find company here
          </button>
        </div>

        // Add to detail mode in VenueCard.tsx (after Piyachok button)

        {/* Email to owner button */}
        <div className="mt-8">
          <button
            onClick={() => setShowEmailForm(!showEmailForm)}
            className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition"
          >
            Send email to owner
          </button>

          {showEmailForm && (
            <form onSubmit={handleEmailSubmit} className="mt-4 space-y-4">
              <textarea
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                placeholder="Your message to the owner..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Send Message
              </button>
            </form>
          )}

          {emailSent && (
            <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              Your message was sent to {venue.owner.email}
            </div>
          )}
        </div>

        {/* Button to open venue news in separate page */}
        <div className="text-center">
          <Link
            to={`/news-venues/${venue.id}`}
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold text-lg py-3 px-8 rounded-lg transition"
          >
            View all venue news
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VenueCard;