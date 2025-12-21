
import SponsoredTopComponent from '../../components/top/SponsoredTopComponent';
import GeneralTopComponent from '../../components/top/GeneralTopComponent';

const TopPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-12 text-center">
          Top Venues
        </h1>

        {/* Sponsored */}
        <SponsoredTopComponent />

        {/* Dynamic Top with Filters */}
        <GeneralTopComponent />
      </div>
    </div>
  );
};

export default TopPage;