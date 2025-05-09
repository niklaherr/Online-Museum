import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { userService } from 'services/UserService';

type HeaderProps = {
  onNavigate: (route: string) => void;
  toggleSidebar: (sidebarOpen: boolean) => void;
  sidebarOpen: boolean;
};
const Header = ({onNavigate, toggleSidebar, sidebarOpen } : HeaderProps) => {

  return (
    <header className="bg-white shadow px-4 py-2 flex items-center justify-between">
      <div className="flex items-center">
        {userService.isLoggedIn() && (
          <button
            onClick={() => toggleSidebar(!sidebarOpen)}
            className="mr-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        
        <Link to="/" className="flex items-center">
          <span className="text-xl font-semibold text-blue-600">HeritageStory</span>
        </Link>
      </div>

      <div className="flex items-center">
        {userService.isLoggedIn() ? (
          <div className="flex items-center space-x-3">
            <Link
              to="/profile"
              className="flex items-center space-x-2 transition-colors hover:text-blue-600 group"
            >
              <span className="hidden md:block">{userService.getUserName()}</span>
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 group-hover:bg-blue-100">
                {userService.getUserName()?.charAt(0)}
              </div>
            </Link>
          </div>
        ) : (
          <div className="space-x-2">
            <Link to="/login" className="px-3 py-1 text-blue-600 hover:text-blue-800">
              Anmelden
            </Link>
            <Link to="/register" className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
              Registrieren
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
