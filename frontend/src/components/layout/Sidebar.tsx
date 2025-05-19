import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { userService } from 'services/UserService';
import { itemService } from 'services/ItemService';
import { GalleryItem } from 'interfaces/Item';
import NotyfService from 'services/NotyfService';

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

// Hilfsfunktion zum Extrahieren und Sortieren der Kategorien
const extractTopCategories = (items: GalleryItem[], count: number = 3): string[] => {
  // Zähle das Vorkommen jeder Kategorie
  const categoryCount: {[key: string]: number} = {};
  
  items.forEach(item => {
    const category = item.category || "Unkategorisiert";
    categoryCount[category] = (categoryCount[category] || 0) + 1;
  });
  
  // Sortiere Kategorien nach Häufigkeit (absteigend)
  const sortedCategories = Object.keys(categoryCount)
    .sort((a, b) => categoryCount[b] - categoryCount[a]);
  
  // Gib die ersten X Kategorien zurück
  return sortedCategories.slice(0, count);
};

const Sidebar = ({ isOpen, setIsOpen } : SidebarProps ) => {
  const location = useLocation();
  const [topCategories, setTopCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Lade alle Items, um die Kategorien zu extrahieren
  useEffect(() => {
    const loadCategories = async () => {
      if (!userService.isLoggedIn()) return;
      
      try {
        const items = await itemService.fetchAllItemsWithUsers();
        const categories = extractTopCategories(items);
        setTopCategories(categories);
      } catch (error) {
        console.error("Fehler beim Laden der Kategorien:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCategories();
  }, []);
  
  // Wenn kein Benutzer angemeldet ist, Sidebar nicht anzeigen
  if (!userService.isLoggedIn()) return null;
  
  // Hauptnavigation-Links
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { path: '/item-list', label: 'Listen', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { 
      path: '/items', 
      label: 'Galerie', 
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      subItems: topCategories.map(category => ({
        path: `/items?category=${encodeURIComponent(category)}`,
        label: category
      }))
    },
  ];

  if (userService.isAdmin()) {
    navItems.push(
      {
        path: '/editorial',
        label: 'Redaktion',
        icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h2l2-2h6l2 2h2a2 2 0 012 2v12a2 2 0 01-2 2zM7 10h10M7 14h10M7 18h6'
      },
      {
        path: '/admin',
        label: 'Admin',
        icon: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h5v-2c0-.66.42-1.25 1-1.45 1.19-.41 2.48-.55 4-.55s2.81.14 4 .55c.58.2 1 .79 1 1.45v2h5v-2c0-2.66-5.33-4-8-4zm5-4v1h2v-1c0-1.1-.9-2-2-2s-2 .9-2 2v1h2z'
      }
    );

    navItems.push({
      path: '/support-requests',
      label: 'Support-Anfragen',
      icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
    });
  }

  return (
    <div 
      className={`${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transform fixed md:relative left-0 top-0 md:translate-x-0 h-full w-64 bg-gray-800 text-white transition-transform duration-300 ease-in-out z-20 shadow-lg`}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Online-Museum</h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-5">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center w-full px-4 py-2 transition-colors duration-200 ${
                  location.pathname === item.path 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                </svg>
                <span>{item.label}</span>
              </Link>
              
              {/* Unterpunkte für Kategorien */}
              {item.subItems && item.subItems.length > 0 && (
                <ul className="pl-12 mt-1 space-y-1">
                  {item.subItems.map((subItem) => (
                    <li key={subItem.path}>
                      <Link
                        to={subItem.path}
                        className={`block text-sm py-1.5 pl-2 border-l border-gray-700 transition-colors duration-200 ${
                          location.search && location.search.includes(`category=${encodeURIComponent(subItem.label)}`)
                            ? 'text-blue-400 border-blue-400'
                            : 'text-gray-400 hover:text-gray-300'
                        }`}
                      >
                        {subItem.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;