import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { userService } from 'services/UserService';

type HeaderProps = {
  onNavigate: (route: string) => void;
  toggleSidebar: (sidebarOpen: boolean) => void;
  sidebarOpen: boolean;
};
const Header = ({onNavigate, toggleSidebar, sidebarOpen } : HeaderProps) => {
  const { user } = useContext(AuthContext);

  const logout = async () => {
    await userService.logout();
    onNavigate('/login');
  };

  return (
    <header className="bg-white shadow px-4 py-2 flex items-center justify-between">
      <div className="flex items-center">
        {user && (
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
        {user ? (
          <div className="relative group">
            <button className="flex items-center space-x-2">
              <span className="hidden md:block">{userService.getUserName()}</span>
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
                {userService.getUserName() ? userService.getUserName()!.charAt(0) : ""}
              </div>
            </button>
            
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-10">
              <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Profil
              </Link>
              <Link to="/storage" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Speicher
              </Link>
              <button 
                onClick={logout}
                className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
              >
                Abmelden
              </button>
            </div>
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