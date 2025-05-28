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
        <div className="relative p-6 h-[75px] w-72 flex items-center px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
          <div className="relative flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">Online-Museum</span>
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
                      ? `bg-gradient-to-r from-blue-50 to-purple-100 text-blue-700 shadow-sm`
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg transition-colors ${
                      isActive 
                        ? `bg-blue-200/50` 
                        : 'bg-gray-100 group-hover:bg-gray-200'
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        isActive ? `text-blue-600` : 'text-gray-500 group-hover:text-gray-700'
                      }`} />
                    </div>
                    <span>{label}</span>
                  </div>
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
                        ? `bg-gradient-to-r from-red-50 to-orange-100 text-red-700 shadow-sm`
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg transition-colors ${
                        isActive 
                          ? `bg-red-200/50` 
                          : 'bg-gray-100 group-hover:bg-gray-200'
                      }`}>
                        <Icon className={`h-5 w-5 ${
                          isActive ? `text-red-600` : 'text-gray-500 group-hover:text-gray-700'
                        }`} />
                      </div>
                      <span>{label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;