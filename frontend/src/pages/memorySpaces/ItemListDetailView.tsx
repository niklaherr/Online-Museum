import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Title,
  Text,
  Button,
  Subtitle,
  Grid,
  Dialog,
  DialogPanel,
  Flex
} from "@tremor/react";
import { UserIcon, TrashIcon } from "@heroicons/react/24/outline";
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
      }
    };

    loadItemLists();
  }, [id]);

  const handleDeleteItemList = async () => {
    if (list) {
      try {
        await itemService.deleteItemList(list.id);
        NotyfService.showSuccess("Item List erfolgreich gelöscht");
        setIsDeleteModalOpen(false);
        onNavigate('/dashboard'); 
      } catch (error) {
        let errorMessage = "Fehler beim Löschen der Item List";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        NotyfService.showError(errorMessage);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Text>Liste wird geladen...</Text>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen space-y-6">
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

          
          {list?.user_id == userService.getUserID() && (<div className="absolute top-4 right-4">
            <Button
            onClick={() => onNavigate(`/item-list/${id}/edit`)}
          >
            Bearbeiten
          </Button>
          </div>)}
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

      {/* Centered Delete Button */}
      {list?.user_id == userService.getUserID() && (
        <div className="mt-auto flex justify-center pb-6">
          <Button
            variant="light"
            color="red"
            icon={TrashIcon}
            onClick={() => setIsDeleteModalOpen(true)} // Show confirmation modal
          >
            Liste löschen
          </Button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <DialogPanel className="max-w-sm bg-white rounded-xl shadow-md p-6">
          <Title>Bist du sicher?</Title>
          <Text>
            Möchtest du diese Liste wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
          </Text>
          <Flex justifyContent="end" className="mt-6 space-x-2">
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
              Abbrechen
            </Button>
            <Button color="red" variant="secondary" onClick={handleDeleteItemList}>
              Ja, löschen
            </Button>
          </Flex>
        </DialogPanel>
      </Dialog>
    </div>
  );
};

export default ItemListDetailView;
