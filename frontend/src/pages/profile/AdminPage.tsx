import { useState } from 'react';
// import { Link } from 'react-router-dom';
import { useAppSelector } from '../../hooks/rtk';
import AdminPendingVenues from "../../components/admin/AdminPendingVenues";
import AdminAllVenues from "../../components/admin/AdminAllVenues";
import AdminAllUsers from "../../components/admin/AdminAllUsers";
import AdminGlobalNews from "../../components/admin/AdminGlobalNews";
import AdminAnalytics from "../../components/admin/AdminAnalytics";
import AdminAppContent from "../../components/admin/AdminAppContent";
import AdminBlockedComments from "../../components/admin/AdminBlockedComments";
import AdminTagsManagement from "../../components/admin/AdminTagsManagement";
import AdminSponsoredTop from "../../components/admin/AdminSponsoredTop";
import AdminForbiddenWords from "../../components/admin/AdminForbiddenWords";

const AdminPage = () => {
  const user = useAppSelector((state) => state.user.user);
  const [activeSection, setActiveSection] = useState<string>('dashboard');

  if (!user?.is_superuser) {
    return (
      <div className="text-center py-20 text-red-600 text-2xl">
        Доступ заборонено — тільки для адміністрації!
      </div>
    );
  }

  const menuItems = [
    { id: 'dashboard', label: 'Панель' },
    { id: 'pending-venues', label: 'Заклади очікують модерацію' },
    { id: 'all-venues', label: 'Всі заклади' },
    { id: 'all-users', label: 'Всі користувачі' },
    { id: 'global-news', label: 'Глобальні новини' },
    { id: 'analytics', label: 'Аналітика' },
    { id: 'app-content', label: 'Вміст застосунку' },
    { id: 'blocked-comments', label: 'Заблоковані коментарі' },
    { id: 'tags', label: 'Управління тегами' },
    { id: 'sponsored-top', label: 'Платний топ' },
    { id: 'forbidden-words', label: 'Заборонена лексика' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-12 text-center tracking-tight">
          Панель Супер Адміна
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sidebar Menu - Wider */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-200">
                Меню Адміністратора
              </h2>
              <nav className="space-y-4">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full text-left px-8 py-5 rounded-xl font-semibold text-lg transition-all shadow-sm ${
                      activeSection === item.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-50 text-gray-800 hover:bg-gray-100 hover:shadow'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content - Much Wider */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              {activeSection === 'dashboard' && (
                <div className="text-center py-20">
                  <h2 className="text-4xl font-bold text-gray-900 mb-8">
                    Вітаємо в адмін-панелі!
                  </h2>
                  <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                    Використовуйте меню зліва для управління закладами, користувачами, новинами, аналітикою, тегами, коментарями та іншим вмістом сайту. Усе під вашим контролем.
                  </p>
                </div>
              )}

              {activeSection === 'pending-venues' && <AdminPendingVenues />}
              {activeSection === 'all-venues' && <AdminAllVenues />}
              {activeSection === 'all-users' && <AdminAllUsers />}
              {activeSection === 'global-news' && <AdminGlobalNews />}
              {activeSection === 'analytics' && <AdminAnalytics />}
              {activeSection === 'app-content' && <AdminAppContent />}
              {activeSection === 'blocked-comments' && <AdminBlockedComments />}
              {activeSection === 'tags' && <AdminTagsManagement />}
              {activeSection === 'sponsored-top' && <AdminSponsoredTop />}
              {activeSection === 'forbidden-words' && <AdminForbiddenWords />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;