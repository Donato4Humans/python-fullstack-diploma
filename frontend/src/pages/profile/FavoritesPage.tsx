import { useGetFavoritesQuery, useRemoveFavoriteMutation } from '../../redux/api/favoritesApi';
import VenueCard from '../../components/venues/VenueCard';
import {Link, useSearchParams} from "react-router-dom";
import PaginationComponent from "../../components/common/PaginationComponent.tsx";

const PAGE_SIZE = 1;

const FavoritesPage = () => {
  const { data: favorites = [], isLoading } = useGetFavoritesQuery();
  const [removeFavorite] = useRemoveFavoriteMutation();

  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const totalPages = Math.ceil((favorites.length || 0) / PAGE_SIZE);
  const paginatedFavorites = favorites.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleRemove = async (favoriteId: number) => {
    if (confirm('Видалити з улюблених?')) {
      await removeFavorite(favoriteId);
    }
  };

  if (isLoading) {
    return <div className="text-center py-20 text-gray-600">Завантаження улюблених закладів...</div>;
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Улюблені заклади</h1>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
          <p className="text-gray-500 text-xl mb-6">У вас ще немає улюблених закладів</p>
          <Link
            to="/venues"
            className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-blue-700 transition"
          >
            Переглянути всі заклади
          </Link>
        </div>
      ) : (
        <>
          {/* Venues Grid  */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {paginatedFavorites.map((favorite) => (
              <div key={favorite.id} className="relative group">
                <VenueCard
                  venue={favorite.venue}
                  mode="grid"
                />

                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(favorite.id)}
                  className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-all hover:bg-red-700 shadow"
                >
                  Видалити
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="pt-8">
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default FavoritesPage;