import React from "react";
import { Card, Text, Button } from "@tremor/react";
import { UserIcon } from "@heroicons/react/24/outline";

interface GalleryModalProps {
  item: any; // The selected item to show in the modal
  onClose: () => void; // Function to close the modal
}

export const GalleryModal: React.FC<GalleryModalProps> = ({ item, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg max-w-4xl w-full">
        <h2 className="text-2xl font-bold mb-4">{item.title}</h2>
        <Text className="text-sm uppercase tracking-wide text-blue-500 font-medium">{item.category}</Text>
        <Text className="text-sm text-gray-500 mt-1">Entered on: {item.entered_on}</Text>

        {/* Image Gallery */}
        <div className="mt-4">
          <div className="flex space-x-4 overflow-x-auto">
            <img
              src={item.image}
              alt={item.name}
              className="w-48 h-48 object-cover rounded-lg border border-gray-300"
            />
          </div>
        </div>

        {/* User Info */}
        <div className="mt-4 flex items-center space-x-2">
          <UserIcon className="w-5 h-5 text-gray-500" />
          <Text className="text-sm text-gray-700">{item.username}</Text>
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-center">
          <Button onClick={onClose} color="red">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
