import React, { useEffect, useState } from "react";
import { Button, Card, Text } from "@tremor/react";
import { UserIcon } from "@heroicons/react/24/outline";
import { GalleryModal } from "../../components/gallery/GalleryModal";
import { userService } from "../../services/UserService";
import Item, { GalleryItem } from "../../interfaces/Item";
import { itemService } from "../../services/ItemService";
import NotyfService from "services/NotyfService";
import { CreateItemModal } from "../../components/gallery/CreateItemModal"; // Import the CreateItemModal
import NoResults from "pages/NoResults";

type GalleryProps = {
  onNavigate: (route: string) => void;
};

const Gallery = ({ onNavigate }: GalleryProps) => {
  // State Hooks
  const [showModal, setShowModal] = useState(false);  // For viewing item details
  const [showCreateModal, setShowCreateModal] = useState(false); // For creating new item
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [museumItems, setMuseumItems] = useState<GalleryItem[]>([]);  // Improved typing
  const [searchQuery, setSearchQuery] = useState("");  // Search query state

  // Function to load items
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

  // Fetch items on initial load
  useEffect(() => {
    loadItems();
  }, []);

  // Filter items based on search query
  const filteredItems = museumItems.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.username.toLowerCase().includes(query) ||
      item.entered_on.toLowerCase().includes(query)
    );
  });

  // Handle item click to open the modal
  const handleItemClick = (item: GalleryItem) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  // Handle closing the Create Item Modal and re-fetching items
  const handleItemCreated = () => {
    setShowCreateModal(false);  // Close the modal
    loadItems();  // Re-fetch the items after a new item has been created
  };

  return (
    <div>
      {/* Top Section: Search Bar and Add Item Button */}
      <div className="flex items-center justify-between mb-6">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by title, user, or date"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border rounded-lg w-1/3" // Adjust width as necessary
        />

        {/* Add New Item Button */}
        <Button
          onClick={() => setShowCreateModal(true)}
          variant="primary"
        >
          Add New Item
        </Button>
      </div>

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-4 gap-6 w-full max-w-screen-xl mx-auto mt-6 px-4">
          {filteredItems.map((item) => (
            <Card
              key={item.id}  // Use a unique identifier
              className="p-4 flex flex-col justify-between shadow-md h-full cursor-pointer"
              onClick={() => handleItemClick(item)}
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

      {/* Museum Items Gallery */}
      

      {/* Gallery Modal for item details */}
      {showModal && selectedItem && (
        <GalleryModal item={selectedItem} onClose={() => setShowModal(false)} />
      )}

      {/* Create Item Modal */}
      {showCreateModal && (
        <CreateItemModal onClose={() => setShowCreateModal(false)} onItemCreated={handleItemCreated} />
      )}
    </div>
  );
};

export default Gallery;
