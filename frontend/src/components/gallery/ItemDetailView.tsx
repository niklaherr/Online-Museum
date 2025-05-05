import React, { useEffect, useState } from "react";
import { Text } from "@tremor/react";
import { UserIcon } from "@heroicons/react/24/outline";
import { useParams } from "react-router-dom";
import { GalleryItem } from "interfaces/Item";
import { itemService } from "services/ItemService";
import NotyfService from "services/NotyfService";
import { userService } from "services/UserService";
import NoResults from "pages/NoResults";

type ItemDetailViewProps = {
  onNavigate: (route: string) => void;
};

const ItemDetailView = ({ onNavigate }: ItemDetailViewProps) => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [item, setItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const loadItem = async () => {
      try {
        const item = await itemService.fetchItemById(parseInt(id!));
        setItem(item);
        setIsLoading(false);
      } catch (err) {
        NotyfService.showError("Fehler beim Laden der Items.");
        userService.logout();
        onNavigate("/login");
      }
    };

    loadItem();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="text-blue-500">
          <svg
            className="animate-spin h-8 w-8"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      </div>
    );
  }

  if (!item) return <NoResults />;

  return (
    <div>
      <h2 className="text-2xl font-bold">{item.title}</h2>
      <Text className="text-sm uppercase tracking-wide text-blue-500 font-medium">
        {item.category}
      </Text>
      <Text className="text-sm text-gray-500">Entered on: {item.entered_on}</Text>
      <Text className="text-sm tracking-wide text-blue-500 font-medium">
        Description
      </Text>
      <Text className="text-sm text-gray-500">{item.description}</Text>
      {/* Image Gallery */}
      <div>
        <img
          src={item.image}
          alt={item.title}
          className="max-w-[50vw] w-full h-auto"
        />
      </div>

      {/* User Info */}
      <div className="flex items-center">
        <UserIcon className="w-5 h-5 text-gray-500" />
        <Text className="text-sm text-gray-700">{item.username}</Text>
      </div>
    </div>

  );
};

export default ItemDetailView;
