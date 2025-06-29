import { useEffect, useState } from "react";
import { Button, Card, Text, Title, Badge } from "@tremor/react";
import { 
  LockClosedIcon, UserIcon, MagnifyingGlassIcon, XMarkIcon, PlusIcon,
  TagIcon, CalendarIcon, PhotoIcon, SparklesIcon
} from "@heroicons/react/24/outline";
import { GalleryItem } from "../../interfaces/Item";
import { itemService } from "../../services/ItemService";
import NotyfService from "services/NotyfService";
import NoResults from "components/helper/NoResults";
import Loading from "components/helper/Loading";
import { useSearchParams } from "react-router-dom";

type GalleryProps = {
  onNavigate: (route: string) => void;
};

// Groups gallery items by their category
const groupItemsByCategory = (items: GalleryItem[]) => {
  const groupedItems: { [key: string]: GalleryItem[] } = {};
  items.forEach((item) => {
    const category = item.category && item.category.trim() !== "" ? item.category : "Unkategorisiert";
    if (!groupedItems[category]) {
      groupedItems[category] = [];
    }
    groupedItems[category].push(item);
  });
  return groupedItems;
};

// Renders a single gallery item as a card
const ItemCard = ({ item, onClick }: { item: GalleryItem; onClick: () => void }) => {
  return (
    <Card
      className="group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
      onClick={onClick}
    >
      {/* Item image or placeholder */}
      <div className="aspect-square w-full overflow-hidden bg-gray-100 mb-4">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <PhotoIcon className="w-12 h-12 opacity-50" />
          </div>
        )}
      </div>

      {/* Card content: category, privacy, title, date, author */}
      <div className="p-4 space-y-3">
        {/* Category badge and privacy icon */}
        <div className="flex justify-between items-start">
          {item.category && (
            <Badge color="blue" icon={TagIcon} size="xs" className="max-w-[120px] truncate">
              {item.category.length > (item.isprivate ? 12 : 15) 
                ? `${item.category.substring(0, item.isprivate ? 12 : 15)}...` 
                : item.category}
            </Badge>
          )}
          {item.isprivate && (
            <div className="p-1 bg-red-100 rounded">
              <LockClosedIcon className="w-4 h-4 text-red-500" />
            </div>
          )}
        </div>

        {/* Item title */}
        <Title className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
          {item.title}
        </Title>

        {/* Date of entry */}
        <Text className="text-xs text-gray-500 flex items-center">
          <CalendarIcon className="w-4 h-4 mr-1" />
          {new Date(item.entered_on).toLocaleDateString('de-DE')}
        </Text>

        {/* Author info */}
        <div className="flex items-center pt-2 border-t border-gray-100">
          <UserIcon className="w-4 h-4 text-gray-400 mr-2" />
          <Text className="text-sm text-gray-600 font-medium">
            {item.username}
          </Text>
        </div>
      </div>
    </Card>
  );
};

// Renders a section for a category with its items
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
      {/* Category header with icon and item count */}
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

      {/* Grid of item cards */}
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

// Main gallery component
const Gallery = ({ onNavigate }: GalleryProps) => {
  const [museumItems, setMuseumItems] = useState<GalleryItem[]>([]);
  const [userItems, setUserItems] = useState<GalleryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category");

  // Loads public and user-owned items from the API
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

  // Filters public items by search query and category
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

  // Filters user-owned items by search query
  const filteredUserItems = userItems.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      (item.category && item.category.toLowerCase().includes(query))
    );
  });

  // Groups filtered public items by category
  const groupedItems = groupItemsByCategory(filteredItems);
  const categories = Object.keys(groupedItems).sort();

  const totalPublicItems = filteredItems.length;
  const totalUserItems = filteredUserItems.length;

  // Clears the search input
  const clearSearch = () => {
    setSearchQuery('');
  };

  if (isLoading) return <Loading />

  return (
    <div className="space-y-8">
      {/* Hero header with stats and create button */}
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

      {/* Search input field */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* No results message for search */}
      {searchQuery && categories.length === 0 && filteredUserItems.length === 0 && (
        <div className="text-center py-8">
          <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Ergebnisse gefunden</h3>
          <p className="text-gray-600 mb-4">
            Wir konnten keine Items finden, die zu "{searchQuery}" passen.
          </p>
          <button 
            onClick={clearSearch}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Suche zurücksetzen
          </button>
        </div>
      )}

      {/* Render public items grouped by category */}
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

      {/* Render user's own items if available */}
      {filteredUserItems.length > 0 && (
        <div className="space-y-12">
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
              {filteredUserItems.length}
            </Badge>
          </div>
          {/* User items are shown together, not grouped by category */}
          <CategorySection
            category="Alle meine Items"
            items={filteredUserItems}
            onNavigate={onNavigate}
          />
        </div>
      )}

      {/* Show generic no results if nothing to display */}
      {!searchQuery && categories.length === 0 && filteredUserItems.length === 0 && (
        <NoResults />
      )}
    </div>
  );
};

export default Gallery;
