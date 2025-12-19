
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
        Access Denied — Superadmin Only
      </div>
    );
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'pending-venues', label: 'Venues Awaiting Moderation' },
    { id: 'all-venues', label: 'All Venues' },
    { id: 'all-users', label: 'All Users' },
    { id: 'global-news', label: 'Global News' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'app-content', label: 'App Content' },
    { id: 'blocked-comments', label: 'Blocked Comments' },
    { id: 'tags', label: 'Manage Tags' },
    { id: 'sponsored-top', label: 'Sponsored Top' },
    { id: 'forbidden-words', label: 'Forbidden Words' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-10 text-center">
          Super Admin Panel
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Menu */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Menu</h2>
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full text-left px-6 py-4 rounded-xl font-medium transition-all ${
                      activeSection === item.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {activeSection === 'dashboard' && (
                <div className="text-center py-16">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Welcome to Admin Panel
                  </h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Use the menu on the left to manage venues, users, news, analytics, and platform content.
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