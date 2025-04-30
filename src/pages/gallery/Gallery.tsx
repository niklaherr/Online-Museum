import React, { useEffect, useState } from "react";
import { Button, Card, Text } from "@tremor/react";
import { UserIcon } from "@heroicons/react/24/outline";
import { GalleryModal } from "../../components/gallery/GalleryModal";
import { userService } from "../../services/UserService";
import Item from "../../interfaces/Item";
import { itemService } from "../../services/ItemService";

const Gallery: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [museumItems, setMuseumItems] = useState<any[]>([]);

  useEffect(() => {
    const loadItems = async () => {
      const items = await itemService.fetchAllItemsWithUsers();
      setMuseumItems(items);
      console.log(items)
    };

    loadItems();
  }, []);

  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  return (
    <div>

      {/* Museum Items Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 w-full max-w-screen-xl mx-auto mt-6 px-4">
        {museumItems.map((item, index) => (
          <Card
            key={index}
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

      {/* Gallery Modal */}
      {showModal && selectedItem && (
        <GalleryModal item={selectedItem} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default Gallery;
