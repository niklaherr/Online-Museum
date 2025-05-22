import React, { useEffect, useState } from "react";
import { Text, Button, Dialog, DialogPanel, Title, Flex } from "@tremor/react";
import { UserIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useParams } from "react-router-dom";
import { GalleryItem } from "interfaces/Item";
import { itemService } from "services/ItemService";
import NotyfService from "services/NotyfService";
import { userService } from "services/UserService";
import NoResults from "components/helper/NoResults";
import Loading from "components/helper/Loading";

type ItemDetailViewProps = {
  onNavigate: (route: string) => void;
};

const ItemDetailView = ({ onNavigate }: ItemDetailViewProps) => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [item, setItem] = useState<GalleryItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const loadItem = async () => {
      try {
        const item = await itemService.fetchItemById(parseInt(id!));
        setItem(item);
        setIsLoading(false);
      } catch (error) {
        let errorMessage = "Fehler beim Laden der Item Informationen";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        NotyfService.showError(errorMessage);
      }
    };

    loadItem();
  }, [id]);

  const handleDeleteItem = async () => {
    if (item) {
      try {
        await itemService.deleteItem(item.id);
        NotyfService.showSuccess("Item successfully deleted!");
        onNavigate("/items"); // Redirect to the list of items after deletion
      } catch (error) {
        let errorMessage = "Fehler beim Löschen des Items";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        NotyfService.showError(errorMessage);
      } finally {
        setIsDeleteModalOpen(false); // Close the confirmation dialog
      }
    }
  };

  if (isLoading) return <Loading />

  if (!item) return <NoResults />;

  return (
    <div className="relative p-4">
      {/* Edit Button */}
      {item.user_id == userService.getUserID() && (<div className="absolute top-4 right-4">
        <Button
          icon={PencilIcon}
          onClick={() => onNavigate(`/items/${id}/edit`)}
          color="blue"
        >
          Edit
        </Button>
      </div>)}

      <h2 className="text-2xl font-bold">{item.title}</h2>
      <Text className="text-sm uppercase tracking-wide text-blue-500 font-medium">
        {item.category}
      </Text>
      <Text className="text-sm text-gray-500">Erstellt am: {new Date(item.entered_on).toLocaleDateString()} • {item.isprivate ? "Privat" : "Öffentlich"}</Text>
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
      <div className="flex items-center mt-4">
        <UserIcon className="w-5 h-5 text-gray-500 mr-2" />
        <Text className="text-sm text-gray-700">{item.username}</Text>
      </div>

      
      {item.user_id == userService.getUserID() && (
        <div className="mt-auto flex justify-center pb-6">
          <Button
            variant="light"
            color="red"
            icon={TrashIcon}
            onClick={() => setIsDeleteModalOpen(true)} // Show confirmation modal
          >
            Item löschen
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
            <Button color="red" variant="secondary" onClick={handleDeleteItem}>
              Ja, löschen
            </Button>
          </Flex>
        </DialogPanel>
      </Dialog>
    </div>
  );
};

export default ItemDetailView;
