// PiyachokPage.tsx
import { useState, useEffect } from 'react';
import PiyachokRequestsComponent from '../../components/piyachok/PiyachokRequestsComponent';
import PiyachokCreateForm from '../../components/piyachok/PiyachokCreateForm';

const PiyachokPage = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem('piyachokWarningAccepted');
    if (!hasAccepted) {
      setShowWarning(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('piyachokWarningAccepted', 'true');
    setShowWarning(false);
  };

  return (
    <>
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Важливе попередження
            </h2>
            <p className="text-lg text-gray-700 mb-6 text-center">
              Адміністрація застерігає: будьте обережні при зустрічах. Не зустрічайтесь з незнайомими людьми в небезпечних чи невідомих місцях. Ваша безпека понад усе!
            </p>
            <button
              onClick={handleAccept}
              className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold hover:bg-purple-700 transition text-lg"
            >
              Підтверджую, буду обережним
            </button>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Piyachok — Знайти компанію
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

          {/* Create form */}
          {showCreateForm && <PiyachokCreateForm onClose={() => setShowCreateForm(false)} />}

          {/* Requests list */}
          <PiyachokRequestsComponent />
        </div>
      </div>
    </>
  );
};

export default PiyachokPage;