import React, { useEffect, useState } from "react";
import { Button, Card, Text } from "@tremor/react";
import { UserIcon } from "@heroicons/react/24/outline";
import { userService } from "../../services/UserService";
import Item, { GalleryItem } from "../../interfaces/Item";
import { itemService } from "../../services/ItemService";
import NotyfService from "services/NotyfService";
import NoResults from "pages/NoResults";

type GalleryProps = {
  onNavigate: (route: string) => void;
};

const Gallery = ({ onNavigate }: GalleryProps) => {
  const [museumItems, setMuseumItems] = useState<GalleryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadItems = async () => {
    try {
      const items = await itemService.fetchAllItemsWithUsers();
      setMuseumItems(items);
      setIsLoading(false);
    } catch (err) {
      NotyfService.showError("Fehler beim Laden der Items.");
      userService.logout();
      onNavigate("/login");
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const filteredItems = museumItems.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.username.toLowerCase().includes(query) ||
      item.entered_on.toLowerCase().includes(query)
    );
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
        <h1 className="text-2xl font-bold text-gray-900">Meine Gallerie</h1>
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
      
      {/* Item Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="p-4 flex flex-col justify-between shadow-md h-full cursor-pointer"
              onClick={() => onNavigate('/items/' + item.id)}
            >
              <Text className="text-sm uppercase tracking-wide text-blue-500 font-medium">
                {item.id}
              </Text>
              <Text className="mt-2 text-lg font-semibold">{item.title}</Text>
              <Text className="text-sm text-gray-500 mt-1">
                Entered on: {item.entered_on}
              </Text>

              <div className="mt-2">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-lg border border-gray-300"
                />
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
  );
};

export default Gallery;