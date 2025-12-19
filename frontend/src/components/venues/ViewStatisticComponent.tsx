import type {IVenue} from "../../models/IVenue";

interface ViewStatisticComponentProps {
  venue: IVenue;
  onClose: () => void;
}

const ViewStatisticComponent = ({ venue, onClose }: ViewStatisticComponentProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl">
        <h3 className="text-2xl font-bold mb-6">Statistics for {venue.title}</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Total Views</p>
            <p className="text-3xl font-bold text-blue-600">{venue.views}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Daily Views</p>
            <p className="text-2xl font-semibold">{venue.daily_views}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Weekly Views</p>
            <p className="text-2xl font-semibold">{venue.weekly_views}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Monthly Views</p>
            <p className="text-2xl font-semibold">{venue.monthly_views}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewStatisticComponent;