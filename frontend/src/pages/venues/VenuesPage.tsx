import VenuesListComponent from '../../components/venues/VenuesListComponent';
import SearchComponent from "../../components/search/SearchComponent.tsx";

const VenuesPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header  */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Всі заклади
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Знайдіть найкращі місця для зустрічей, відпочинку чи роботи — від кафе до барів і ресторанів
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <SearchComponent />
        </div>

        {/* Venues List */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
          <VenuesListComponent />
        </div>
      </div>
    </div>
  );
};

export default VenuesPage;