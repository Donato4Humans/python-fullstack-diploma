
import { useState } from 'react';
import SponsoredTopComponent from '../../components/top/SponsoredTopComponent';
import GeneralTopComponent from '../../components/top/GeneralTopComponent';

const TopPage = () => {
  const [selectedTopType, setSelectedTopType] = useState<'sponsored' | 'category' | 'tag' | 'general'>('general');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center">
          Top Venues
        </h1>

        {/* Sponsored top — always shown at top */}
        <SponsoredTopComponent />

        {/* Dropdown to switch general top type */}
        <div className="mb-8 text-center">
          <label className="text-lg font-semibold text-gray-700 mr-4">
            View top by:
          </label>
          <select
            value={selectedTopType}
            onChange={(e) => setSelectedTopType(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="general">General (by rating)</option>
            <option value="category">By category</option>
            <option value="tag">By tag</option>
          </select>
        </div>

        {/* General top based on selection */}
        <GeneralTopComponent type={selectedTopType} />
      </div>
    </div>
  );
};

export default TopPage;