import React, { useEffect, useState } from "react";
import { Button, Card, Text } from "@tremor/react";
import { UserIcon } from "@heroicons/react/24/outline";
import { GalleryModal } from "../../components/gallery/GalleryModal";
import { userService } from "../../services/UserService";
import Item, { GalleryItem } from "../../interfaces/Item";
import { itemService } from "../../services/ItemService";
import NotyfService from "services/NotyfService";
import { CreateItemModal } from "../../components/gallery/CreateItemModal";
import NoResults from "pages/NoResults";

type GalleryProps = {
  onNavigate: (route: string) => void;
};

const Gallery = ({ onNavigate }: GalleryProps) => {
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [museumItems, setMuseumItems] = useState<GalleryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const loadItems = async () => {
    try {
      const items = await itemService.fetchAllItemsWithUsers();
      setMuseumItems(items);
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

  const handleItemClick = (item: GalleryItem) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleItemCreated = () => {
    setShowCreateModal(false);
    loadItems();
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4">
      {/* Header: Title and Button */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Meine Galerie</h1>
        <Button
          onClick={() => setShowCreateModal(true)}
          color="blue"
          className="text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          + Neues Item
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by title, user, or date"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Item Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="p-4 flex flex-col justify-between shadow-md h-full cursor-pointer"
              onClick={() => handleItemClick(item)}
            >
              <Text className="text-sm uppercase tracking-wide text-blue-500 font-medium">
                {item.category}
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

      {/* Modals */}
      {showModal && selectedItem && (
        <GalleryModal item={selectedItem} onClose={() => setShowModal(false)} />
      )}
      {showCreateModal && (
        <CreateItemModal
          onClose={() => setShowCreateModal(false)}
          onItemCreated={handleItemCreated}
        />
      )}
    </div>
  );
};

export default Gallery;
