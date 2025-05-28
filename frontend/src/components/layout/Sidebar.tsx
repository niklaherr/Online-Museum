import { Dispatch, SetStateAction } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { userService } from 'services/UserService';
import {
  HomeIcon,
  ClipboardIcon,
  NewspaperIcon,
  UserGroupIcon,
  PhotoIcon,
  EnvelopeIcon,
  XMarkIcon,
  SparklesIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const location = useLocation();

  if (!userService.isLoggedIn) return null;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: HomeIcon, color: 'blue' },
    { path: '/item-list', label: 'Listen', icon: ClipboardIcon, color: 'green' },
    { path: '/items', label: 'Meine Galerie', icon: PhotoIcon, color: 'purple' },
  ];

  const adminItems = [
    { path: '/editorial', label: 'Redaktion', icon: NewspaperIcon, color: 'indigo' },
    { path: '/admin', label: 'Admin', icon: UserGroupIcon, color: 'red' },
    { path: '/support-requests', label: 'Support-Anfragen', icon: EnvelopeIcon, color: 'orange' }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative z-50 h-full w-72 bg-white shadow-2xl transform transition-all duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:block border-r border-gray-100`}
      >
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
          <div className="relative flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">Online-Museum</span>
                <div className="text-blue-100 text-sm font-medium">
                  {userService.getUserName()}
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <div className="mb-6">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
              Hauptbereich
            </div>
            
            {navItems.map(({ path, label, icon: Icon, color }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsOpen(false)}
                  className={`group flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? `bg-gradient-to-r from-${color}-50 to-${color}-100 text-${color}-700 shadow-sm`
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg transition-colors ${
                      isActive 
                        ? `bg-${color}-200/50` 
                        : 'bg-gray-100 group-hover:bg-gray-200'
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        isActive ? `text-${color}-600` : 'text-gray-500 group-hover:text-gray-700'
                      }`} />
                    </div>
                    <span>{label}</span>
                  </div>
                  
                  {isActive && (
                    <ChevronRightIcon className={`h-4 w-4 text-${color}-500`} />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Admin Section */}
          {userService.isadmin() && (
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
                Administration
              </div>
              
              {adminItems.map(({ path, label, icon: Icon, color }) => {
                const isActive = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setIsOpen(false)}
                    className={`group flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? `bg-gradient-to-r from-${color}-50 to-${color}-100 text-${color}-700 shadow-sm`
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg transition-colors ${
                        isActive 
                          ? `bg-${color}-200/50` 
                          : 'bg-gray-100 group-hover:bg-gray-200'
                      }`}>
                        <Icon className={`h-5 w-5 ${
                          isActive ? `text-${color}-600` : 'text-gray-500 group-hover:text-gray-700'
                        }`} />
                      </div>
                      <span>{label}</span>
                    </div>
                    
                    {isActive && (
                      <ChevronRightIcon className={`h-4 w-4 text-${color}-500`} />
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">
              Eingeloggt als
            </div>
            <div className="text-sm font-medium text-gray-900">
              {userService.getUserName()}
            </div>
            {userService.isadmin() && (
              <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 mt-2">
                Administrator
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;