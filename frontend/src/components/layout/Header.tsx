import { Link } from 'react-router-dom';
import { userService } from 'services/UserService';
import { Flex } from '@tremor/react';
import { Bars3Icon, UserCircleIcon, ChevronDownIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

type HeaderProps = {
  onNavigate: (route: string) => void;
  toggleSidebar: (sidebarOpen: boolean) => void;
  sidebarOpen: boolean;
};

// Header component for the main navigation bar
const Header = ({ onNavigate, toggleSidebar, sidebarOpen }: HeaderProps) => {
  const isLoggedIn = userService.isLoggedIn();
  const userName = userService.getUserName();
  const isadmin = userService.isadmin();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-30 h-[75px]">
      <div className="px-4 py-3">
        <Flex justifyContent="between" alignItems="center">
          {/* Left Side: Logo and sidebar toggle */}
          <Flex alignItems="center" className="gap-2 sm:gap-4">
            {/* Sidebar toggle button for logged-in users (mobile only) */}
            {isLoggedIn && (
              <button
                onClick={() => toggleSidebar(!sidebarOpen)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 md:hidden"
                aria-label="Toggle sidebar"
              >
                <Bars3Icon className="w-6 h-6" />
              </button>
            )}

            {/* Logo for guests */}
            {!isLoggedIn && (
              <Link to="/" className="flex items-center space-x-2 sm:space-x-4">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                  <SparklesIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="lg:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Online-Museum
                  </div>
                </div>
              </Link>
            )}
          </Flex>

          {/* Right Side: User menu or login/register */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {isLoggedIn ? (
              // User menu for logged-in users
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 sm:space-x-3 p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
                >
                  {/* User avatar with admin badge */}
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                      {userName?.charAt(0).toUpperCase()}
                    </div>
                    {isadmin && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  {/* User info (name and role) */}
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-gray-900">{userName}</div>
                    {isadmin && (
                      <div className="text-xs text-red-600 font-medium">Administrator</div>
                    )}
                  </div>

                  {/* Dropdown arrow */}
                  <ChevronDownIcon
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                      showUserMenu ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown menu */}
                {showUserMenu && (
                  <>
                    {/* Overlay to close menu on outside click */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20">
                      {/* User info in dropdown */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                            {userName?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{userName}</div>
                            <div className="text-sm text-gray-500">
                              {isadmin ? 'Administrator' : 'Benutzer'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Dropdown actions */}
                      <div className="py-2">
                        <Link
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <UserCircleIcon className="w-4 h-4 mr-3" />
                          Mein Profil
                        </Link>

                        <button
                          onClick={() => {
                            userService.logout();
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <svg
                            className="w-4 h-4 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          Abmelden
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              // Login and register buttons for guests
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Link
                  to="/login"
                  className="px-2.5 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium"
                >
                  Anmelden
                </Link>
                <Link
                  to="/register"
                  className="px-2.5 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
                >
                  Registrieren
                </Link>
              </div>
            )}
          </div>
        </Flex>
      </div>
    </header>
  );
};

export default Header;
