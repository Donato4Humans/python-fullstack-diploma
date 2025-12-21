import type { ReactNode } from 'react';
import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../hooks/rtk'; // your Redux hook
import { RoleEnum } from '../enums/RoleEnum';
import {getUserRole} from "../helpers/getRole";


// Profile menu — defines who sees what
const profileMenu = [
  {
    path: '/profile',
    label: 'Профіль.Головна',
    roles: [RoleEnum.USER, RoleEnum.VENUE_ADMIN, RoleEnum.CRITIC, RoleEnum.SUPERADMIN],
  },
  {
    path: '/profile/my-venues',
    label: 'Мої заклади',
    roles: [RoleEnum.VENUE_ADMIN, RoleEnum.SUPERADMIN],
  },
  {
    path: '/profile/create-venue',
    label: 'Створити заклад',
    roles: [RoleEnum.USER, RoleEnum.VENUE_ADMIN, RoleEnum.SUPERADMIN],
  },
  {
    path: '/profile/favorites',
    label: 'Улюблені заклади',
    roles: [RoleEnum.USER, RoleEnum.CRITIC, RoleEnum.VENUE_ADMIN, RoleEnum.SUPERADMIN],
  },
  {
    path: '/profile/comments',
    label: 'Мої коментарі',
    roles: [RoleEnum.USER, RoleEnum.CRITIC, RoleEnum.VENUE_ADMIN, RoleEnum.SUPERADMIN],
  },
  {
    path: '/profile/reviews',
    label: 'Мої оцінки',
    roles: [RoleEnum.USER, RoleEnum.CRITIC, RoleEnum.VENUE_ADMIN, RoleEnum.SUPERADMIN],
  },
  {
    path: '/profile/matches',
    label: 'Мої схвалені запити.Пиячок',
    roles: [RoleEnum.USER, RoleEnum.CRITIC, RoleEnum.VENUE_ADMIN, RoleEnum.SUPERADMIN],
  },
  {
    path: '/profile/security',
    label: 'Безпека.',
    roles: [RoleEnum.USER, RoleEnum.CRITIC, RoleEnum.VENUE_ADMIN, RoleEnum.SUPERADMIN],
  },
  {
    path: '/profile/admin',
    label: 'Адмін панель',
    roles: [RoleEnum.SUPERADMIN],
  },
];

// Route protection — if user doesn't have permission for current page → redirect to main profile
function RequireProfileRole({ children }: { children: ReactNode }) {
  const { user } = useAppSelector((state) => state.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  const role = getUserRole(user);
  const currentMenuItem = profileMenu.find(
    (item) => location.pathname === item.path || location.pathname.startsWith(item.path + '/')
  );

  if (currentMenuItem && !currentMenuItem.roles.includes(role)) {
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
}

// Main profile layout
export default function ProfileLayout() {
  const { user } = useAppSelector((state) => state.user);
  const role = getUserRole(user);

  // If not logged in — redirect to login
  if (!user) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left sidebar — menu */}
            <aside className="w-full md:w-64 bg-gray-100 border-r border-gray-200">
              <div className="p-6">
                {/* User info */}
                <div className="text-center md:text-left mb-6">
                  <div className="w-20 h-20 mx-auto md:mx-0 bg-gray-300 rounded-full flex items-center justify-center text-3xl font-bold text-gray-600">
                    {user.profile?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <h2 className="mt-3 text-xl font-semibold">
                    {user.profile?.name || user.email}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {role === RoleEnum.USER && 'Користувач'}
                    {role === RoleEnum.VENUE_ADMIN && 'Власник закладу'}
                    {role === RoleEnum.CRITIC && 'Критик'}
                    {role === RoleEnum.SUPERADMIN && 'Суперадмін'}
                  </p>
                </div>

                {/* Navigation */}
                <nav className="space-y-1">
                  {profileMenu
                    .filter((item) => item.roles.includes(role))
                    .map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        end
                        className={({ isActive }) =>
                          `block w-full text-left px-4 py-3 rounded-lg transition-colors ${
                            isActive
                              ? 'bg-blue-600 text-white font-medium'
                              : 'text-gray-700 hover:bg-gray-200'
                          }`
                        }
                      >
                        {item.label}
                      </NavLink>
                    ))}
                </nav>
              </div>
            </aside>

            {/* Right part — page content */}
            <main className="flex-1 p-6 md:p-10">
              <RequireProfileRole>
                <Outlet /> {/* Renders the selected profile page */}
              </RequireProfileRole>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}