import ItemList from 'interfaces/ItemList';
import Editorial from 'interfaces/Editorial';
import NoResults from 'pages/NoResults';
import { useState, useEffect } from 'react';
import { itemService } from 'services/ItemService';
import { editorialService } from 'services/EditorialService';
import NotyfService from 'services/NotyfService';
import { userService } from 'services/UserService';

type ItemListCardProps = {
  list: ItemList | Editorial;
  onView: (id: number, type: 'item-list' | 'editorial') => void;
};

const ItemListCard = ({ list, onView }: ItemListCardProps) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onView(list.id, 'editorial' in list ? 'editorial' : 'item-list')}
    >
      <div className="h-40 bg-gray-200 relative">
        <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500">
            <svg className="w-16 h-16 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
          <h3 className="text-white font-medium truncate">{list.title}</h3>
        </div>
        <div className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full px-2 py-1 text-xs font-medium">
          {'editorial' in list ? 'Redaktionell' : (false ? 'Privat' : 'Öffentlich')}
        </div>
      </div>
      <div className="p-4">
        <p className="text-gray-500 text-sm mb-2">
          Erstellt am {new Date(list.entered_on).toLocaleDateString()}
        </p>
        <p className="text-gray-700 line-clamp-2 text-sm">{list.description}</p>
      </div>
    </div>
  );
};

type ItemListViewProps = {
  onViewSpace: (id: number, type?: string) => void;
  onNavigate: (route: string) => void;
};

const ItemListView = ({ onViewSpace, onNavigate }: ItemListViewProps) => {
  const [itemLists, setItemLists] = useState<ItemList[]>([]);
  const [editorialLists, setEditorialLists] = useState<Editorial[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(true);
  const [isLoadingEditorials, setIsLoadingEditorials] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'private', 'public'
  const [searchTerm, setSearchTerm] = useState('');
  const [userItemLists, setUserItemLists] = useState<ItemList[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load regular item lists
        const fetchedItemLists = await itemService.fetchItemLists();
        setItemLists(fetchedItemLists);
        
        // Filter for user's own item lists
        const userId = userService.getUserID();
        if (userId) {
          const userLists = fetchedItemLists.filter(list => list.user_id === userId);
          setUserItemLists(userLists);
        }
        
        setIsLoadingItems(false);
      } catch (error) {
        let errorMessage = "Fehler beim Laden der Erinnerungsräume";
        if(error instanceof Error) {
          errorMessage = error.message;
        }
        NotyfService.showError(errorMessage);
      }

      try {
        // Load editorial lists
        const fetchedEditorials = await editorialService.fetchEditorialLists();
        setEditorialLists(fetchedEditorials);
        setIsLoadingEditorials(false);
      } catch (error) {
        let errorMessage = "Fehler beim Laden der redaktionellen Listen";
        if(error instanceof Error) {
          errorMessage = error.message;
        }
        NotyfService.showError(errorMessage);
      }
    };

    loadData();
  }, []);

  // Filtering and searching for item lists
  const filteredItemLists = itemLists.filter(list => {
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        list.title.toLowerCase().includes(term) || 
        (list.description && list.description.toLowerCase().includes(term))
      );
    }
    return true;
  });

  // Filtering and searching for editorial lists
  const filteredEditorials = editorialLists.filter(editorial => {
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        editorial.title.toLowerCase().includes(term) || 
        (editorial.description && editorial.description.toLowerCase().includes(term))
      );
    }
    return true;
  });

  // Filtering and searching for user's item lists
  const filteredUserItemLists = userItemLists.filter(list => {
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        list.title.toLowerCase().includes(term) || 
        (list.description && list.description.toLowerCase().includes(term))
      );
    }
    return true;
  });

  const handleViewSpace = (id: number, type: 'item-list' | 'editorial') => {
    if (type === 'editorial') {
      onNavigate(`/editorial/${id}`);
    } else {
      onViewSpace(id);
    }
  };

  if (isLoadingItems && isLoadingEditorials) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="text-blue-500">
          <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Erinnerungsräume</h1>
        <button 
          onClick={() => onNavigate('/item-list/create')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          + Neuer Raum
        </button>
      </div>
      
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Editorial Lists Section */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Von unserer Redaktion</h2>
        </div>

        {isLoadingEditorials ? (
          <div className="flex justify-center items-center p-6">
            <div className="text-amber-500">
              <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
        ) : filteredEditorials.length === 0 ? (
          <NoResults />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEditorials.map(editorial => (
              <ItemListCard 
                key={`editorial-${editorial.id}`} 
                list={editorial} 
                onView={(id) => handleViewSpace(id, 'editorial')} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Public Lists Section */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Öffentliche Listen</h2>
        </div>
        
        {isLoadingItems ? (
          <div className="flex justify-center items-center p-6">
            <div className="text-blue-500">
              <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
        ) : filteredItemLists.length === 0 ? (
          <NoResults />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItemLists.map(list => (
              <ItemListCard 
                key={`itemlist-${list.id}`} 
                list={list} 
                onView={(id) => handleViewSpace(id, 'item-list')} 
              />
            ))}
          </div>
        )}
      </div>

      {/* User's Personal Lists Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Deine Listen</h2>
        </div>
        
        {isLoadingItems ? (
          <div className="flex justify-center items-center p-6">
            <div className="text-blue-500">
              <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
        ) : filteredUserItemLists.length === 0 ? (
          <NoResults />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUserItemLists.map(list => (
              <ItemListCard 
                key={`user-itemlist-${list.id}`} 
                list={list} 
                onView={(id) => handleViewSpace(id, 'item-list')} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemListView;