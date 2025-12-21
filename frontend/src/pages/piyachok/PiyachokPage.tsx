
import { useState } from 'react';
import PiyachokRequestsComponent from '../../components/piyachok/PiyachokRequestsComponent';
import PiyachokCreateForm from '../../components/piyachok/PiyachokCreateForm';

const PiyachokPage = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Piyachok — Find Company
        </h1>

        {/* Add new request button */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xl py-4 px-8 rounded-xl transition"
          >
            {showCreateForm ? 'Скасувати' : 'Додати новий запит'}
          </button>
        </div>

        {/* Create form — toggle show/hide */}
        {showCreateForm && <PiyachokCreateForm onClose={() => setShowCreateForm(false)} />}

        {/* Requests list */}
        <PiyachokRequestsComponent />
      </div>
    </div>
  );
};

export default PiyachokPage;