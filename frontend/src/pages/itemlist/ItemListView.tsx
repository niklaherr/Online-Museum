import ItemList from 'interfaces/ItemList';
import Editorial from 'interfaces/Editorial';
import NoResults from 'components/helper/NoResults';
import { useState, useEffect } from 'react';
import { itemService } from 'services/ItemService';
import { editorialService } from 'services/EditorialService';
import NotyfService from 'services/NotyfService';
import Loading from 'components/helper/Loading';
import { Badge, Card, Flex, Title, Text } from '@tremor/react';
import { SparklesIcon } from '@heroicons/react/24/outline';

type ItemListCardProps = {
  list: ItemList | Editorial;
  onView: (id: number, type: 'item-list' | 'editorial') => void;
};

const ItemListCard = ({ list, onView }: ItemListCardProps) => {
  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onView(list.id, 'editorial' in list ? 'editorial' : 'item-list')}
    >
      <div className="h-40 w-full relative mb-4 rounded-lg bg-blue-100 flex items-center justify-center">
        <SparklesIcon className="w-16 h-16 text-blue-500 opacity-40" />

        {/* Overlay Title */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 rounded-b-lg">
          <Title className="text-white truncate">{list.title}</Title>
        </div>

        {/* Badge Status */}
        <div className="absolute top-2 right-2">
          <Badge color={!('isprivate' in list)
            ? "indigo"
            : list.isprivate
              ? "gray"
              : "amber"}>
            {!('isprivate' in list)
            ? 'Redaktionell'
            : list.isprivate
              ? 'Privat'
              : 'Öffentlich'}
          </Badge>
        </div>
      </div>

      <Flex flexDirection="col" alignItems="start" justifyContent="start" className="space-y-1">
        <Text className="text-gray-500 text-sm">
          Erstellt am {new Date(list.entered_on).toLocaleDateString()}
        </Text>
        <Text className="text-sm text-gray-700 line-clamp-2">
          {list.description}
        </Text>
      </Flex>
    </Card>

  );
};

type ItemListViewProps = {
  onViewSpace: (id: number, type?: string) => void;
  onNavigate: (route: string) => void;
};

const ItemListView = ({ onViewSpace, onNavigate }: ItemListViewProps) => {
  const [itemLists, setItemLists] = useState<ItemList[]>([]);
  const [editorialLists, setEditorialLists] = useState<Editorial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userItemLists, setUserItemLists] = useState<ItemList[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load regular item lists
        const fetchedItemLists = await itemService.fetchPublicLists();
        setItemLists(fetchedItemLists);
        
        // Filter for user's own item lists
        const userlists = await itemService.fetchUserLists();
        setUserItemLists(userlists);

        const fetchedEditorials = await editorialService.fetchEditorialLists();
        setEditorialLists(fetchedEditorials);
        setIsLoading(false)
        
      } catch (error) {
        let errorMessage = "Fehler beim Laden der Listen";
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

  if (isLoading) return <Loading />

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

      {filteredEditorials.length === 0 && filteredItemLists.length === 0 && filteredUserItemLists.length === 0 && (
        <NoResults />
      )}

      {filteredEditorials.length !== 0 && (
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Von unserer Redaktion</h2>
          </div>

          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEditorials.map(editorial => (
              <ItemListCard 
                key={`editorial-${editorial.id}`} 
                list={editorial} 
                onView={(id) => handleViewSpace(id, 'editorial')} 
              />
            ))}
          </div>
        </div>
      )}

      

      {filteredItemLists.length !== 0 && (
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Öffentliche Listen</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItemLists.map(list => (
                <ItemListCard 
                  key={`itemlist-${list.id}`} 
                  list={list} 
                  onView={(id) => handleViewSpace(id, 'item-list')} 
                />
              ))}
            </div>
        </div>
      )}
      
      {filteredUserItemLists.length !== 0 && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Deine Listen</h2>
          </div>
          

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUserItemLists.map(list => (
                <ItemListCard 
                  key={`user-itemlist-${list.id}`} 
                  list={list} 
                  onView={(id) => handleViewSpace(id, 'item-list')} 
                />
              ))}
            </div>
        </div>
      )}

      
    </div>
  );
};

export default ItemListView;