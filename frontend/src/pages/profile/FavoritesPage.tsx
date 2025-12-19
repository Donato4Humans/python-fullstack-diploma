
import { useGetFavoritesQuery, useRemoveFavoriteMutation } from '../../redux/api/favoritesApi';
import VenueCard from '../../components/venues/VenueCard';

const FavoritesPage = () => {
  const { data: favorites = [], isLoading } = useGetFavoritesQuery();
  const [removeFavorite] = useRemoveFavoriteMutation();

  const handleRemove = async (favoriteId: number) => {
    if (confirm('Remove from favorites?')) {
      await removeFavorite(favoriteId);
    }
  };

  if (isLoading) {
    return <div className="text-center py-20 text-gray-600">Loading favorites...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Favorites</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {favorites.map((favorite) => (
          <div key={favorite.id} className="relative">
            <VenueCard venue={favorite.venue} mode="grid" />
            <button onClick={() => handleRemove(favorite.id)} className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded text-sm">
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;