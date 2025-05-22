import { Link } from 'react-router-dom';
import { userService } from 'services/UserService';
import { Flex, Text } from '@tremor/react';
import { Bars3Icon } from '@heroicons/react/24/outline';

type HeaderProps = {
  onNavigate: (route: string) => void;
  toggleSidebar: (sidebarOpen: boolean) => void;
  sidebarOpen: boolean;
};

const Header = ({ onNavigate, toggleSidebar, sidebarOpen }: HeaderProps) => {
  const isLoggedIn = userService.isLoggedIn();
  const userName = userService.getUserName();

  return (
    <header className="bg-white shadow px-4 py-3">
      <Flex justifyContent="between" alignItems="center">
        <Flex alignItems="center" className="gap-3">
          {isLoggedIn && (
            <button
              onClick={() => toggleSidebar(!sidebarOpen)}
              className="text-gray-600 hover:text-gray-900 md:hidden"
              aria-label="Toggle sidebar"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
          )}

          <Link to="/dashboard" className="text-xl font-semibold text-blue-600">
            Online-Museum
          </Link>
        </Flex>

        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <Link
              to="/profile"
              className="flex items-center space-x-2 group"
            >
              <Text className="hidden md:block">{userName}</Text>
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 group-hover:bg-blue-100">
                {userName?.charAt(0)}
              </div>
            </Link>
          ) : (
            <div className="space-x-2">
              <Link
                to="/login"
                className="px-3 py-1 text-blue-600 hover:text-blue-800 transition"
              >
                Anmelden
              </Link>
              <Link
                to="/register"
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Registrieren
              </Link>
            </div>
          )}
        </div>
      </Flex>
    </header>
  );
};

export default Header;
