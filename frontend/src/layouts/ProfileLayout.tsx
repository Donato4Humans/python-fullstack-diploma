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
    roles: [RoleEnum.USER,RoleEnum.VENUE_ADMIN, RoleEnum.SUPERADMIN],
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
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left sidebar — menu */}
            <aside className="w-full lg:w-80 bg-gray-50 border-r border-gray-200 lg:min-h-[calc(100vh-6rem)]">
              <div className="p-8 lg:p-10">
                {/* User info */}
                <div className="text-center lg:text-left mb-10">
                  <div className="w-24 h-24 mx-auto lg:mx-0 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                    {user.profile?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <h2 className="mt-4 text-2xl font-bold text-gray-900">
                    {user.profile?.name || user.email.split('@')[0]}
                  </h2>
                  <p className="text-sm text-gray-600 mt-2 font-medium">
                    {role === RoleEnum.USER && 'Користувач'}
                    {role === RoleEnum.VENUE_ADMIN && 'Власник закладу'}
                    {role === RoleEnum.CRITIC && 'Критик'}
                    {role === RoleEnum.SUPERADMIN && 'Суперадмін'}
                  </p>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                  {profileMenu
                    .filter((item) => item.roles.includes(role))
                    .map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        end
                        className={({ isActive }) =>
                          `block w-full text-left px-6 py-4 rounded-xl transition-all font-medium text-lg ${
                            isActive
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'text-gray-700 hover:bg-gray-100 hover:shadow'
                          }`
                        }
                      >
                        {item.label}
                      </NavLink>
                    ))}
                </nav>
              </div>
            </aside>

            {/* Right part — page content (wider) */}
            <main className="flex-1 p-8 lg:p-12 bg-white">
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