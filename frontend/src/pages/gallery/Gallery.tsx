import React, { useEffect, useState } from "react";
import { Button, Card, Text, Title, Badge } from "@tremor/react";
import { 
  LockClosedIcon, 
  UserIcon, 
  MagnifyingGlassIcon,
  PlusIcon,
  TagIcon,
  CalendarIcon,
  EyeIcon,
  PhotoIcon,
  SparklesIcon,
  RectangleGroupIcon
} from "@heroicons/react/24/outline";
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
  
  items.forEach((item) => {
    const category = item.category || "Unkategorisiert";
    if (!groupedItems[category]) {
      groupedItems[category] = [];
    }
    groupedItems[category].push(item);
  });
  
  return groupedItems;
};

// Modern Item Card Component
const ItemCard = ({ item, onClick }: { item: GalleryItem; onClick: () => void }) => {
  return (
    <Card
      className="group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden bg-white border-0 shadow-lg"
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <PhotoIcon className="w-16 h-16 text-gray-400 opacity-50" />
          </div>
        )}
        
        {/* Overlay with badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Status badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {item.isprivate && (
            <Badge color="red" icon={LockClosedIcon} size="xs">
              Privat
            </Badge>
          )}
        </div>

        {/* Category badge */}
        {item.category && (
          <div className="absolute top-3 left-3">
            <Badge color="blue" icon={TagIcon} size="xs">
              {item.category}
            </Badge>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <Title className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
          {item.title}
        </Title>

        {/* Date */}
        <div className="flex items-center text-xs text-gray-500">
          <CalendarIcon className="w-4 h-4 mr-1" />
          <span>{new Date(item.entered_on).toLocaleDateString('de-DE')}</span>
        </div>

        {/* Author */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center">
            <UserIcon className="w-4 h-4 text-gray-400 mr-2" />
            <Text className="text-sm text-gray-600 font-medium">
              {item.username}
            </Text>
          </div>
          
          {/* View indicator */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <EyeIcon className="w-4 h-4 text-blue-500" />
          </div>
        </div>
      </div>
    </Card>
  );
};

// Category Section Component
const CategorySection = ({ 
  category, 
  items, 
  onNavigate 
}: { 
  category: string; 
  items: GalleryItem[]; 
  onNavigate: (route: string) => void;
}) => {
  return (
    <div className="space-y-6">
      {/* Category Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <TagIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <Title className="text-2xl text-gray-900">{category}</Title>
            <Text className="text-gray-600">
              {items.length} {items.length === 1 ? "Item" : "Items"}
            </Text>
          </div>
        </div>
        <Badge color="blue" size="lg">
          {items.length}
        </Badge>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onClick={() => onNavigate('/items/' + item.id)}
          />
        ))}
      </div>
    </div>
  );
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
    
    if (categoryFilter) {
      const itemCategory = item.category || "Unkategorisiert";
      return matchesSearch && itemCategory === categoryFilter;
    }
    
    return matchesSearch;
  });

  // Gruppiere die gefilterten Items nach Kategorien
  const groupedItems = groupItemsByCategory(filteredItems);
  const categories = Object.keys(groupedItems).sort();

  const totalPublicItems = filteredItems.length;
  const totalUserItems = userItems.length;
  const totalCategories = categories.length;

  if (isLoading) return <Loading />

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl overflow-hidden shadow-2xl">
        <div className="relative p-8 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <Title className="text-3xl font-bold text-white mb-2">
                {categoryFilter ? `Kategorie: ${categoryFilter}` : 'Meine Galerie'}
              </Title>
              <Text className="text-blue-100 text-lg">
                {categoryFilter 
                  ? `${totalPublicItems} Items in dieser Kategorie entdecken`
                  : 'Entdecken Sie Kunstwerke und Sammlungen aus der Community'
                }
              </Text>
              <div className="flex items-center space-x-6 mt-4 text-blue-100">
                <div className="flex items-center">
                  <PhotoIcon className="w-5 h-5 mr-2" />
                  <span>{totalPublicItems} öffentliche Items</span>
                </div>
                <div className="flex items-center">
                  <RectangleGroupIcon className="w-5 h-5 mr-2" />
                  <span>{totalCategories} Kategorien</span>
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="w-5 h-5 mr-2" />
                  <span>{totalUserItems} eigene Items</span>
                </div>
              </div>
            </div>
            
            <Button
              icon={PlusIcon}
              onClick={() => onNavigate('/items/create')}
              className="bg-white text-blue-600 hover:bg-blue-50 border-0 shadow-lg"
              size="lg"
            >
              Neues Item
            </Button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <div className="p-6">
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Items durchsuchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>
      </Card>

      {/* Public Items by Category */}
      {categories.length > 0 && (
        <div className="space-y-12">
          {categories.map((category) => (
            <CategorySection
              key={category}
              category={category}
              items={groupedItems[category]}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}

      {/* User's Items Section */}
      {userItems.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <SparklesIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <Title className="text-2xl text-gray-900">Meine Items</Title>
                <Text className="text-gray-600">Ihre persönlichen Kunstwerke und Sammlungen</Text>
              </div>
            </div>
            <Badge color="green" size="lg">
              {userItems.length}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {userItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onClick={() => onNavigate('/items/' + item.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {categories.length === 0 && userItems.length === 0 && <NoResults />}

      {/* Statistics Footer */}
      <Card>
        <div className="p-6">
          <Title className="text-lg mb-4 text-center">Galerie-Übersicht</Title>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {totalPublicItems}
              </div>
              <Text className="text-blue-800 text-sm font-medium">
                Öffentliche Items
              </Text>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {totalUserItems}
              </div>
              <Text className="text-green-800 text-sm font-medium">
                Eigene Items
              </Text>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {totalCategories}
              </div>
              <Text className="text-purple-800 text-sm font-medium">
                Kategorien
              </Text>
            </div>
            
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600 mb-1">
                {totalPublicItems + totalUserItems}
              </div>
              <Text className="text-indigo-800 text-sm font-medium">
                Gesamt
              </Text>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Gallery;