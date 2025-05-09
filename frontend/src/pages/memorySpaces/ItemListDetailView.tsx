import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Title,
  Text,
  Button,
  Subtitle,
  Grid,
  Col
} from "@tremor/react";
import { UserIcon } from "@heroicons/react/24/outline";
import { GalleryItem } from "interfaces/Item";
import ItemList from "interfaces/ItemList";
import { itemService } from "services/ItemService";
import NotyfService from "services/NotyfService";
import { userService } from "services/UserService";
import NoResults from "pages/NoResults";

type ItemListDetailViewProps = {
  onNavigate: (route: string) => void;
};

const ItemListDetailView = ({ onNavigate }: ItemListDetailViewProps) => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [list, setList] = useState<ItemList | null>(null);

  useEffect(() => {
    const loadItemLists = async () => {
      try {
        const itemLists = await itemService.fetchItemsByItemListId(parseInt(id!));
        setItems(itemLists);
        const itemList = await itemService.fetchItemListById(id!);
        setList(itemList);
        setIsLoading(false);
      } catch (error) {
        let errorMessage = "Fehler beim Laden der Items";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        NotyfService.showError(errorMessage);
        userService.logout();
      }
    };

    loadItemLists();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Text>Liste wird geladen...</Text>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-blue-100 p-6 relative rounded-xl">
        <div className="flex justify-between items-start">
          <div>
            <Title className="text-blue-800">{list?.title}</Title>
            <Subtitle className="text-blue-700 mt-1">{list?.description}</Subtitle>
            <Text className="text-blue-700 mt-2">
              Erstellt am: {list?.entered_on} • {true ? "Privat" : "Öffentlich"}
            </Text>
          </div>

          <div className="space-x-2">
            <Button
              onClick={() => onNavigate(`/item-list/${id}/edit`)}
            >
              Bearbeiten
            </Button>
          </div>
        </div>
      </Card>

      {/* Items */}
      {items.length > 0 ? (
        <Grid className="gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card
              key={item.id}
              className="p-4 cursor-pointer hover:shadow-md transition"
              onClick={() => onNavigate(`/items/${item.id}`)}
            >
              <Text className="text-sm font-semibold text-blue-500 uppercase">
                {item.category}
              </Text>
              <Title className="mt-2">{item.title}</Title>
              <Text className="text-xs text-gray-500 mt-1">
                Eingetragen am: {item.entered_on}
              </Text>

              <div className="mt-3">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-md border"
                />
              </div>

              <div className="mt-3 flex items-center space-x-2">
                <UserIcon className="w-4 h-4 text-gray-500" />
                <Text className="text-sm text-gray-600">{item.username}</Text>
              </div>
            </Card>
          ))}
        </Grid>
      ) : (
        <NoResults />
      )}
    </div>
  );
};

export default ItemListDetailView;
