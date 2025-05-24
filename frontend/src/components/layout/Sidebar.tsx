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
} from '@heroicons/react/24/outline';

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const location = useLocation();

  if (!userService.isLoggedIn) return null;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: HomeIcon },
    { path: '/item-list', label: 'Listen', icon: ClipboardIcon },
    { path: '/items', label: 'Meine Galerie', icon: PhotoIcon },
  ];

  if (userService.isadmin()) {
    navItems.push(
      { path: '/editorial', label: 'Redaktion', icon: NewspaperIcon },
      { path: '/admin', label: 'Admin', icon: UserGroupIcon },
      { path: '/support-requests', label: 'Support-Anfragen', icon: EnvelopeIcon }
    );
  }

  return (
    <div
      className={`fixed md:relative z-20 h-full w-64 p-0 bg-[#1F2937] shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:block`}
    >
      {/* Sidebar Header */}
      <div className="p-4 flex justify-between items-center">
        <span className="text-xl font-bold text-white">Online-Museum</span>
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden text-white hover:text-gray-300"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Divider */}
      <hr className="border-gray-700 mx-4" />

      {/* Navigation */}
      <nav className="mt-4">
        <ul className="space-y-1 px-2">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <li key={path}>
                <Link
                  to={path}
                  onClick={() => setIsOpen(false)} // ← close on link click
                  className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-800'
                      : 'text-white hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
