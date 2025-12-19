
import { useState } from 'react';
import SponsoredTopComponent from '../../components/top/SponsoredTopComponent';
import GeneralTopComponent from '../../components/top/GeneralTopComponent';

const TopPage = () => {
  const [topType, setTopType] = useState<'general' | 'category' | 'tag'>('general');

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-12 text-center">
          Top Venues
        </h1>

        {/* Sponsored */}
        <SponsoredTopComponent />

        {/* Selector */}
        <div className="text-center mb-12">
          <div className="inline-flex rounded-lg shadow-lg bg-white p-1">
            <button
              onClick={() => setTopType('general')}
              className={`px-6 py-3 rounded-md font-medium transition ${
                topType === 'general' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              General
            </button>
            <button
              onClick={() => setTopType('category')}
              className={`px-6 py-3 rounded-md font-medium transition ${
                topType === 'category' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              By Category
            </button>
            <button
              onClick={() => setTopType('tag')}
              className={`px-6 py-3 rounded-md font-medium transition ${
                topType === 'tag' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              By Tag
            </button>
          </div>
        </div>

        {/* General top */}
        <GeneralTopComponent type={topType} />
      </div>
    </div>
  );
};

export default TopPage;