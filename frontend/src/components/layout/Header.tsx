import { Link } from 'react-router-dom';
import { userService } from 'services/UserService';
import { Flex, Text } from '@tremor/react';
import { 
  Bars3Icon, 
  SparklesIcon, 
  UserCircleIcon,
  ChevronDownIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

type HeaderProps = {
  onNavigate: (route: string) => void;
  toggleSidebar: (sidebarOpen: boolean) => void;
  sidebarOpen: boolean;
};

const Header = ({ onNavigate, toggleSidebar, sidebarOpen }: HeaderProps) => {
  const isLoggedIn = userService.isLoggedIn();
  const userName = userService.getUserName();
  const isAdmin = userService.isAdmin();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-30">
      <div className="px-4 py-3">
        <Flex justifyContent="between" alignItems="center">
          {/* Left Side */}
          <Flex alignItems="center" className="gap-4">
            {/* Mobile Menu Button */}
            {isLoggedIn && (
              <button
                onClick={() => toggleSidebar(!sidebarOpen)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 md:hidden"
                aria-label="Toggle sidebar"
              >
                <Bars3Icon className="w-6 h-6" />
              </button>
            )}

            {/* Logo */}
            <Link 
              to={isLoggedIn ? "/dashboard" : "/"} 
              className="flex items-center space-x-3 group"
            >
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Online-Museum
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  Digitale Erinnerungsräume
                </div>
              </div>
            </Link>
          </Flex>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {/* Notifications */}
                <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200">
                  <BellIcon className="w-5 h-5" />
                  {/* Notification Dot */}
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
                  >
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                        {userName?.charAt(0).toUpperCase()}
                      </div>
                      {isAdmin && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>

                    {/* User Info */}
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-medium text-gray-900">
                        {userName}
                      </div>
                      {isAdmin && (
                        <div className="text-xs text-red-600 font-medium">
                          Administrator
                        </div>
                      )}
                    </div>

                    <ChevronDownIcon className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                      showUserMenu ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <>
                      {/* Backdrop */}
                      <div 
                        className="fixed inset-0 z-10"
                        onClick={() => setShowUserMenu(false)}
                      />
                      
                      {/* Menu */}
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20">
                        {/* User Info Header */}
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                              {userName?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{userName}</div>
                              <div className="text-sm text-gray-500">
                                {isAdmin ? 'Administrator' : 'Benutzer'}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
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
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Abmelden
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              /* Guest Actions */
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
                >
                  Anmelden
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium"
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