import { UserIcon } from '@heroicons/react/24/outline';
import { Card, Text } from '@tremor/react';
import { GalleryItem } from 'interfaces/Item';
import ItemList from 'interfaces/ItemList';
import NoResults from 'pages/NoResults';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { itemService } from 'services/ItemService';
import NotyfService from 'services/NotyfService';
import { userService } from 'services/UserService';

type ItemListDetailViewProps = {
  onNavigate: (route: string) => void;
};
const ItemListDetailView = ({onNavigate } : ItemListDetailViewProps) => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'image', 'video', 'audio', 'document'

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [list, setList] = useState<ItemList | null>(null);

  useEffect(() => {
    const loadItemLists = async () => {
      try {
        const itemLists = await itemService.fetchItemsByItemListId(parseInt(id!));
        setItems(itemLists);
        const itemList = await itemService.fetchItemListById(id!);
        setList(itemList);
        setIsLoading(false)
      } catch (err) {
        NotyfService.showError("Fehler beim Laden der Items.");
        userService.logout()
        onNavigate('/login')
      }
    };

    loadItemLists();
  }, []);

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
      {/* Header mit Titelbild */}
      <div className="relative mb-6">
        <div className="h-48 md:h-64 bg-blue-100 rounded-lg overflow-hidden">
            <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500">
              <svg className="w-20 h-20 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg"></div>
        </div>
        
        <div className="absolute bottom-4 left-4 md:left-6 right-4 md:right-6">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white shadow-sm">{list?.title}</h1>
              <div className="mt-1 flex items-center text-white text-opacity-90 text-sm">
                <span>{list?.title}</span>
                <span className="mx-2">•</span>
                <span>Erstellt am {new Date().toLocaleDateString('de-DE')}</span>
                <span className="mx-2">•</span>
                <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full">
                  {true ? 'Privat' : 'Öffentlich'}
                </span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button className="bg-white text-gray-800 px-3 py-1 rounded-lg text-sm font-medium hover:bg-opacity-90">
                Bearbeiten
              </button>
              <button className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-700">
                + Hinzufügen
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Beschreibung */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-2">Über diesen Erinnerungsraum</h2>
        <p className="text-gray-700">{list?.description}</p>
      </div>
      
      {/* Items */}
      <div className="bg-white rounded-lg shadow-sm mb-6">

        {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-4 gap-6 w-full max-w-screen-xl mx-auto mt-6 px-4">
          {items.map((item) => (
            <Card
              key={item.id}  // Use a unique identifier
              className="p-4 flex flex-col justify-between shadow-md h-full cursor-pointer"
              //onClick={() => handleItemClick(item)}
            >
              <Text className="text-sm uppercase tracking-wide text-blue-500 font-medium">{item.category}</Text>
              <Text className="mt-2 text-lg font-semibold">{item.title}</Text>
              <Text className="text-sm text-gray-500 mt-1">Entered on: {item.entered_on}</Text>

              <div className="mt-2">
                <div className="flex space-x-4 overflow-x-auto">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-48 h-48 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center space-x-2">
                <UserIcon className="w-5 h-5 text-gray-500" />
                <Text className="text-sm text-gray-700">{item.username}</Text>
              </div>
            </Card>
          ))}
        </div>
        ) : (
          <NoResults />
        )}
        
        
      </div>
      
      {/* Aktionsleiste am unteren Rand */}
      <div className="bottom-4 bg-white rounded-lg shadow-md p-3 flex justify-between items-center">
        <div className="flex space-x-4">
          <button className="flex items-center text-gray-700 hover:text-blue-600">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm">Zeitstrahl</span>
          </button>
          <button className="flex items-center text-gray-700 hover:text-blue-600">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm">Karte</span>
          </button>
        </div>
        
        <div>
          <button className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-700">
            Teilen
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemListDetailView;