import ItemList from 'interfaces/ItemList';
import { useState, useEffect } from 'react';
import { itemService } from 'services/ItemService';
import NotyfService from 'services/NotyfService';
import { userService } from 'services/UserService';

type SpaceCardProps = {
  list: ItemList
  onView: (id: number) => void;
};

// Komponente für eine einzelne Erinnerungsraum-Karte
const SpaceCard = ({ list, onView }: SpaceCardProps) => {
  
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
          {34} Einträge • Erstellt am {new Date().toLocaleDateString('de-DE')}
        </p>
        <p className="text-gray-700 line-clamp-2 text-sm">{list.description}</p>
      </div>
    </div>
  );
};

type MemorySpaceListProps = {
  onViewSpace: (id: number) => void;
  onNavigate: (route: string) => void;
};

const MemorySpaceList = ({ onViewSpace, onNavigate }: MemorySpaceListProps) => {
  const [itemLists, setItemLists] = useState<ItemList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'private', 'public'
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const loadItemLists = async () => {
      try {
        const itemLists = await itemService.fetchItemLists();
        setItemLists(itemLists);
        setIsLoading(false);
      } catch (err) {
        NotyfService.showError("Fehler beim Laden der Items.");
        userService.logout()
        onNavigate('/login')
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
          onClick={() => setShowCreateModal(true)}
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
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Alle
          </button>
          <button 
            onClick={() => setFilter('public')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              filter === 'public' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Öffentlich
          </button>
          <button 
            onClick={() => setFilter('private')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              filter === 'private' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Privat
          </button>
        </div>
      </div>
      
      {filteredLists.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Keine Erinnerungsräume gefunden</h3>
          <p className="mt-1 text-gray-500">
            {searchTerm 
              ? `Keine Ergebnisse für "${searchTerm}". Versuche einen anderen Suchbegriff.` 
              : 'Erstelle deinen ersten Erinnerungsraum, um Erinnerungen zu sammeln.'}
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Erinnerungsraum erstellen
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLists.map(list => (
            <SpaceCard key={list.id} list={list} onView={onViewSpace} />
          ))}
        </div>
      )}
      
      {/* Hier könnte ein Modal zur Erstellung neuer Räume implementiert werden */}
    </div>
  );
};

export default MemorySpaceList;