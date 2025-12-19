
import VenuesListComponent from '../../components/venues/VenuesListComponent';

const VenuesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          All Venues
        </h1>
        <VenuesListComponent />
      </div>
    </div>
  );
};

export default VenuesPage;