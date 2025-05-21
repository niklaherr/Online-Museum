import React, { useEffect, useState } from "react";
import { Button, Card, Text, Title } from "@tremor/react";
import { LockClosedIcon, UserIcon } from "@heroicons/react/24/outline";
import { userService } from "../../services/UserService";
import Item, { GalleryItem } from "../../interfaces/Item";
import { itemService } from "../../services/ItemService";
import NotyfService from "services/NotyfService";
import NoResults from "components/helper/NoResults";
import Loading from "components/helper/Loading";
import { useSearchParams } from "react-router-dom";

type GalleryProps = {
  onNavigate: (route: string) => void;
};

// Gruppiert Items nach Kategorien
const groupItemsByCategory = (items: GalleryItem[]) => {
  const groupedItems: { [key: string]: GalleryItem[] } = {};
  
  // Füge "Unkategorisiert" für Items ohne Kategorie hinzu
  items.forEach((item) => {
    const category = item.category || "Unkategorisiert";
    if (!groupedItems[category]) {
      groupedItems[category] = [];
    }
    groupedItems[category].push(item);
  });
  
  return groupedItems;
};

const Gallery = ({ onNavigate }: GalleryProps) => {
  const [museumItems, setMuseumItems] = useState<GalleryItem[]>([]);
  const [userItems, setUserItems] = useState<GalleryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category");

  const loadItems = async () => {
    try {
      const items = await itemService.fetchItemsNotOwnedByUser();
      setMuseumItems(items);
      const userItems = await itemService.fetchOwnItems();
      setUserItems(userItems);
      setIsLoading(false);
    } catch (error) {
      let errorMessage = "Fehler beim Laden der Items"
      if(error instanceof Error) {
        errorMessage = error.message
      }
      NotyfService.showError(errorMessage)
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  // Filtere Items basierend auf der Suche und dem Kategorie-Filter
  const filteredItems = museumItems.filter((item) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      item.title.toLowerCase().includes(query) ||
      item.username.toLowerCase().includes(query) ||
      (item.category && item.category.toLowerCase().includes(query));
    
    // Wenn ein Kategorie-Filter gesetzt ist, filtere entsprechend
    if (categoryFilter) {
      const itemCategory = item.category || "Unkategorisiert";
      return matchesSearch && itemCategory === categoryFilter;
    }
    
    return matchesSearch;
  });

  // Gruppiere die gefilterten Items nach Kategorien
  const groupedItems = groupItemsByCategory(filteredItems);
  const categories = Object.keys(groupedItems).sort();

  if (isLoading) return <Loading />

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {categoryFilter ? `Kategorie: ${categoryFilter}` : 'Meine Galerie'}
          </h1>
          {categoryFilter && (
            <p className="text-sm text-gray-500">
              {groupedItems[categoryFilter]?.length || 0} Items in dieser Kategorie
            </p>
          )}
        </div>
        <button 
          onClick={() => onNavigate('/items/create')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          + Neues Item
        </button>
      </div>
      
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      {categories.length > 0 ? (
        <div className="space-y-10">
          {categories.map((category) => (
            <div key={category} className="space-y-4">
              <div className="border-b border-gray-200 pb-2">
                <Title className="text-xl font-bold text-gray-800">
                  {category}
                </Title>
                <Text className="text-sm text-gray-500">
                  {groupedItems[category].length} {groupedItems[category].length === 1 ? "Item" : "Items"}
                </Text>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {groupedItems[category].map((item) => (
                  <Card
                    key={item.id}
                    className="p-4 flex flex-col justify-between shadow-md h-full cursor-pointer"
                    onClick={() => onNavigate('/items/' + item.id)}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                <Text className="text-sm uppercase tracking-wide text-blue-500 font-medium">
                          {item.category || "Unkategorisiert"}
                        </Text>
              </div>

              <Text className="mt-2 text-lg font-semibold line-clamp-2">{item.title}</Text>
                      <Text className="text-sm text-gray-500 mt-1">
                        {new Date(item.entered_on).toLocaleDateString()}
                      </Text>
                    </div>

                    <div className="mt-2">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-40 object-cover rounded-lg border border-gray-300"
                        />
                      ) : (
                        <div className="w-full h-40 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center text-gray-400">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex items-center space-x-2">
                      <UserIcon className="w-5 h-5 text-gray-500" />
                      <Text className="text-sm text-gray-700">{item.username}</Text>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <NoResults />
      )}

      {userItems.length > 0 && (
        <div className="space-y-10">
          <div className="space-y-4">
              <div className="border-b border-gray-200 pb-2 space-y-10">
                <Title className="text-xl font-bold text-gray-800">
                  Meine Items
                </Title>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {userItems.map((item) => (
                  <Card
                    key={item.id}
                    className="p-4 flex flex-col justify-between shadow-md h-full cursor-pointer"
                    onClick={() => onNavigate('/items/' + item.id)}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                <Text className="text-sm uppercase tracking-wide text-blue-500 font-medium">
                          {item.category || "Unkategorisiert"}
                        </Text>
                        {item.isprivate && (
                  <div className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                    <LockClosedIcon className="w-4 h-4" />
                    Privat
                  </div>
                )}
              </div>

              <Text className="mt-2 text-lg font-semibold line-clamp-2">{item.title}</Text>
                      <Text className="text-sm text-gray-500 mt-1">
                        {new Date(item.entered_on).toLocaleDateString()}
                      </Text>
                    </div>

                    <div className="mt-2">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-40 object-cover rounded-lg border border-gray-300"
                        />
                      ) : (
                        <div className="w-full h-40 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center text-gray-400">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
        </div>
      )}

      
    </div>
  );
};

export default Gallery;