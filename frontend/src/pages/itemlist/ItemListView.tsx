import ItemList from 'interfaces/ItemList';
import NoResults from 'pages/NoResults';
import { useState, useEffect } from 'react';
import { itemService } from 'services/ItemService';
import NotyfService from 'services/NotyfService';
import { userService } from 'services/UserService';

type ItemListCardProps = {
  list: ItemList
  onView: (id: number) => void;
};

const ItemListCard = ({ list, onView }: ItemListCardProps) => {
  
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onView(list.id)}
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
          {false ? 'Privat' : 'Öffentlich'}
        </div>
      </div>
      <div className="p-4">
        <p className="text-gray-500 text-sm mb-2">
          Erstellt am {list.entered_on}
        </p>
        <p className="text-gray-700 line-clamp-2 text-sm">{list.description}</p>
      </div>
    </div>
  );
};

type ItemListViewProps = {
  onViewSpace: (id: number) => void;
  onNavigate: (route: string) => void;
};

const ItemListView = ({ onViewSpace, onNavigate }: ItemListViewProps) => {
  const [itemLists, setItemLists] = useState<ItemList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadItemLists = async () => {
      try {
        const itemLists = await itemService.fetchItemLists();
        setItemLists(itemLists);
        setIsLoading(false);
      } catch (error) {
        let errorMessage = "Fehler beim Laden der Items"
        if(error instanceof Error) {
          errorMessage = error.message
        }
        NotyfService.showError(errorMessage)
      }
    };

    loadItemLists();
  }, []);

  // Filtern und Suchen der Erinnerungsräume
  const filteredLists = itemLists.filter(list => {
    
    // Nach Suchbegriff filtern
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        list.title.toLowerCase().includes(term) || 
        list.description.toLowerCase().includes(term)
      );
    }
    
    return true;
  });

  if (isLoading) {
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
        <h1 className="text-2xl font-bold text-gray-900">Meine Erinnerungsräume</h1>
        <button 
          onClick={() => onNavigate('/item-list/create')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          + Neuer Raum
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Von unserer Redaktion</h1>
      </div>

      {filteredLists.length === 0 ? (
        <NoResults />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLists.map(list => (
            <ItemListCard key={list.id} list={list} onView={onViewSpace} />
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Öffentliche Listen</h1>
      </div>
      
      {filteredLists.length === 0 ? (
        <NoResults />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLists.map(list => (
            <ItemListCard key={list.id} list={list} onView={onViewSpace} />
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Deine Listen</h1>
      </div>
      
      {filteredLists.length === 0 ? (
        <NoResults />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLists.map(list => (
            <ItemListCard key={list.id} list={list} onView={onViewSpace} />
          ))}
        </div>
      )}

      
    </div>
  );
};

export default ItemListView;