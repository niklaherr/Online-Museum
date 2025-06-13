import { useState, useEffect } from 'react';
import { Badge, Card, Title, Text, Button } from '@tremor/react';
import { SparklesIcon, MagnifyingGlassIcon, XMarkIcon, PlusIcon, CalendarIcon, LockClosedIcon, EyeIcon, RectangleStackIcon, UserGroupIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import ItemList from 'interfaces/ItemList';
import Editorial from 'interfaces/Editorial';
import NoResults from 'components/helper/NoResults';
import Loading from 'components/helper/Loading';
import { itemService } from 'services/ItemService';
import { editorialService } from 'services/EditorialService';
import NotyfService from 'services/NotyfService';

// Card component for displaying either an ItemList or Editorial
type ItemListCardProps = {
  list: ItemList | Editorial;
  onView: (id: number, type: 'item-list' | 'editorial') => void;
};

const ItemListCard = ({ list, onView }: ItemListCardProps) => {
  const isEditorial = !('isprivate' in list);
  const hasMainImage = 'main_image' in list && list.main_image;

  return (
    <Card
      className="group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden bg-white border-0 shadow-lg"
      onClick={() => onView(list.id, isEditorial ? 'editorial' : 'item-list')}
    >
      {/* Image or icon area with status badge */}
      <div className="relative h-48 w-full overflow-hidden rounded-xl">
        {hasMainImage ? (
          <img
            src={(list as ItemList).main_image!}
            alt={list.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center h-full">
            {/* Decorative background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 w-16 h-16 bg-blue-300 rounded-full"></div>
              <div className="absolute bottom-4 left-4 w-12 h-12 bg-purple-300 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-indigo-200 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
            {/* Central icon */}
            <div className="relative z-10 p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              {isEditorial ? (
                <SparklesIcon className="w-12 h-12 text-blue-600" />
              ) : (
                <RectangleStackIcon className="w-12 h-12 text-indigo-600" />
              )}
            </div>
          </div>
        )}
        {/* Gradient overlay at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/20 to-transparent h-16"></div>
      </div>

      {/* Card content: title, description, metadata */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <div>
          <Title className="text-xl mb-2 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2 leading-tight">
            {list.title}
          </Title>
        </div>
        {/* Description if available */}
        {list.description && (
          <Text className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
            {list.description}
          </Text>
        )}
        {/* Metadata: date and status */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <div className="flex items-center">
            <CalendarIcon className="w-4 h-4 mr-1" />
            <span>{new Date(list.entered_on).toLocaleDateString('de-DE')}</span>
          </div>
          {isEditorial ? (
            <div className="flex items-center text-indigo-600">
              <SparklesIcon className="w-4 h-4 mr-1" />
              <span className="font-medium">Kuratiert</span>
            </div>
          ) : (
            <div className="flex items-center">
              {('isprivate' in list && list.isprivate) ? (
                <>
                  <LockClosedIcon className="w-4 h-4 mr-1 text-red-500" />
                  <span className="text-red-600 font-medium">Privat</span>
                </>
              ) : (
                <>
                  <EyeIcon className="w-4 h-4 mr-1 text-green-500" />
                  <span className="text-green-600 font-medium">Öffentlich</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

// Props for the main ItemListView component
type ItemListViewProps = {
  onViewSpace: (id: number, type?: string) => void;
  onNavigate: (route: string) => void;
};

// Main component for displaying all list sections and search
const ItemListView = ({ onViewSpace, onNavigate }: ItemListViewProps) => {
  // State for lists, loading, and search
  const [itemLists, setItemLists] = useState<ItemList[]>([]);
  const [editorialLists, setEditorialLists] = useState<Editorial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userItemLists, setUserItemLists] = useState<ItemList[]>([]);

  // Load lists on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedItemLists = await itemService.fetchPublicLists();
        setItemLists(fetchedItemLists);

        const userlists = await itemService.fetchUserLists();
        setUserItemLists(userlists);

        const fetchedEditorials = await editorialService.fetchEditorialLists();
        setEditorialLists(fetchedEditorials);
        setIsLoading(false)
      } catch (error) {
        let errorMessage = "Fehler beim Laden der Listen";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        NotyfService.showError(errorMessage);
      }
    };
    loadData();
  }, []);

  // Filter lists by search term
  const filteredItemLists = itemLists.filter(list => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        list.title.toLowerCase().includes(term) ||
        (list.description && list.description.toLowerCase().includes(term))
      );
    }
    return true;
  });

  const filteredEditorials = editorialLists.filter(editorial => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        editorial.title.toLowerCase().includes(term) ||
        (editorial.description && editorial.description.toLowerCase().includes(term))
      );
    }
    return true;
  });

  const filteredUserItemLists = userItemLists.filter(list => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        list.title.toLowerCase().includes(term) ||
        (list.description && list.description.toLowerCase().includes(term))
      );
    }
    return true;
  });

  // Handle navigation when a card is clicked
  const handleViewSpace = (id: number, type: 'item-list' | 'editorial') => {
    if (type === 'editorial') {
      onNavigate(`/editorial/${id}`);
    } else {
      onViewSpace(id);
    }
  };

  // Clear the search field
  const clearSearch = () => {
    setSearchTerm('');
  };

  if (isLoading) return <Loading />

  const totalLists = filteredEditorials.length + filteredItemLists.length + filteredUserItemLists.length;

  return (
    <div className="space-y-8">
      {/* Header with title, description, and create button */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl overflow-hidden shadow-2xl">
        <div className="relative p-8 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <Title className="text-3xl font-bold text-white mb-2">Erinnerungsräume</Title>
              <Text className="text-blue-100 text-lg">
                Entdecken Sie kuratierte Sammlungen und erstellen Sie eigene Erinnerungsräume
              </Text>
              <div className="flex items-center space-x-6 mt-4 text-blue-100">
                <div className="flex items-center">
                  <RectangleStackIcon className="w-5 h-5 mr-2" />
                  <span>{totalLists} Listen verfügbar</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="w-5 h-5 mr-2" />
                  <span>{filteredEditorials.length} Redaktionell</span>
                </div>
              </div>
            </div>
            
            <Button
              icon={PlusIcon}
              onClick={() => onNavigate('/item-list/create')}
              className="bg-white text-blue-600 hover:bg-blue-50 border-0 shadow-lg"
              size="lg"
            >
              Neue Item-Liste
            </Button>
          </div>
        </div>
      </div>

      {/* Search input */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* No results message if search yields nothing */}
      {searchTerm && filteredEditorials.length === 0 && filteredItemLists.length === 0 && filteredUserItemLists.length === 0 && (
        <div className="text-center py-8">
          <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Ergebnisse gefunden</h3>
          <p className="text-gray-600 mb-4">
            Wir konnten keine Erinnerungsräume finden, die zu "{searchTerm}" passen.
          </p>
          <button 
            onClick={clearSearch}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Suche zurücksetzen
          </button>
        </div>
      )}

      {/* No results message if there are no lists at all */}
      {!searchTerm && totalLists === 0 && <NoResults />}

      {/* Editorial lists section */}
      {filteredEditorials.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <SparklesIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <Title className="text-2xl text-gray-900">Von unserer Redaktion</Title>
                <Text className="text-gray-600">Handverlesene und kuratierte Sammlungen</Text>
              </div>
            </div>
            <Badge color="indigo" size="lg">
              {filteredEditorials.length} Listen
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

      {/* Public lists section */}
      {filteredItemLists.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <GlobeAltIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <Title className="text-2xl text-gray-900">Öffentliche Listen</Title>
                <Text className="text-gray-600">Von der Community geteilte Sammlungen</Text>
              </div>
            </div>
            <Badge color="green" size="lg">
              {filteredItemLists.length} Listen
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
      
      {/* User's own lists section */}
      {filteredUserItemLists.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserGroupIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <Title className="text-2xl text-gray-900">Deine Listen</Title>
                <Text className="text-gray-600">Ihre persönlichen Erinnerungsräume</Text>
              </div>
            </div>
            <Badge color="blue" size="lg">
              {filteredUserItemLists.length} Listen
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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