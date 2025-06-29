import React, { useEffect, useState } from "react";
import { Text, Button, Title, Card, Badge } from "@tremor/react";
import { UserIcon, PencilIcon, TrashIcon, CalendarIcon, TagIcon, LockClosedIcon, EyeIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useParams } from "react-router-dom";
import { GalleryItem } from "interfaces/Item";
import { itemService } from "services/ItemService";
import NotyfService from "services/NotyfService";
import { userService } from "services/UserService";
import NoResults from "components/helper/NoResults";
import Loading from "components/helper/Loading";
import AlertDialog from "components/helper/AlertDialog";

type ItemDetailViewProps = {
  onNavigate: (route: string) => void;
};

const ItemDetailView = ({ onNavigate }: ItemDetailViewProps) => {
  // Get item ID from route params and set up state
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [item, setItem] = useState<GalleryItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch item data on mount or when ID changes
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

  // Handle item deletion with confirmation
  const handleDeleteItem = async () => {
    if (item) {
      try {
        await itemService.deleteItem(item.id);
        NotyfService.showSuccess("Item erfolgreich gelöscht");
        onNavigate("/items"); // Redirect after deletion
      } catch (error) {
        let errorMessage = "Fehler beim Löschen des Items";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        NotyfService.showError(errorMessage);
      } finally {
        setIsDeleteModalOpen(false); // Always close modal
      }
    }
  };

  // Show loading or no results if needed
  if (isLoading) return <Loading />;
  if (!item) return <NoResults />;

  // Check if current user is the owner
  const isOwner = item.user_id === userService.getUserID();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Back navigation button */}
      <div className="flex items-center mb-6">
        <Button
          variant="light"
          icon={ArrowLeftIcon}
          onClick={() => onNavigate("/items")}
          className="mr-4"
        >
          Zurück zur Galerie
        </Button>
      </div>

      {/* Main item details card */}
      <Card className="overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          {/* Image section */}
          <div className="space-y-4">
            <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-100 border-2 border-gray-200">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <EyeIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <Text>Kein Bild verfügbar</Text>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Item content and meta info */}
          <div className="space-y-6">
            {/* Header with badges */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {item.category && (
                  <Badge color="blue" icon={TagIcon}>
                    {item.category}
                  </Badge>
                )}
                {item.isprivate ? (
                  <Badge color="red" icon={LockClosedIcon}>
                    Privat
                  </Badge>
                ) : (
                  <Badge color="green" icon={EyeIcon}>
                    Öffentlich
                  </Badge>
                )}
                {isOwner && (
                  <Badge color="gray">
                    Eigenes Item
                  </Badge>
                )}
              </div>
              <div>
                <Title className="text-3xl text-gray-900 mb-2 leading-tight">
                  {item.title}
                </Title>
              </div>
            </div>

            {/* Meta information: date and user */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center text-gray-600">
                <CalendarIcon className="w-5 h-5 mr-3 text-blue-500" />
                <Text className="font-medium">Erstellt am:</Text>
                <Text className="ml-2">
                  {new Date(item.entered_on).toLocaleDateString('de-DE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              </div>
              <div className="flex items-center text-gray-600">
                <UserIcon className="w-5 h-5 mr-3 text-blue-500" />
                <Text className="font-medium">Erstellt von:</Text>
                <Text className="ml-2">{item.username}</Text>
              </div>
            </div>

            {/* Item description */}
            {item.description && (
              <div className="space-y-2">
                <Title className="text-lg text-gray-800">Beschreibung</Title>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <Text className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {item.description}
                  </Text>
                </div>
              </div>
            )}

            {/* Edit and delete buttons for owner */}
            {isOwner && (
              <div className="pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-3">
                  <Button
                    icon={PencilIcon}
                    onClick={() => onNavigate(`/items/${id}/edit`)}
                    color="blue"
                    className="flex-1 sm:flex-none"
                  >
                    Bearbeiten
                  </Button>
                  <Button
                    variant="light"
                    color="red"
                    icon={TrashIcon}
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="flex-1 sm:flex-none"
                  >
                    Löschen
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Additional item details card */}
      <Card>
        <div className="p-6">
          <Title className="text-lg mb-4">Item-Details</Title>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-blue-50 rounded-lg p-3">
              <Text className="font-medium text-blue-800">Item-ID</Text>
              <Text className="text-blue-600">{item.id}</Text>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <Text className="font-medium text-green-800">Benutzer-ID</Text>
              <Text className="text-green-600">{item.user_id}</Text>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <Text className="font-medium text-purple-800">Sichtbarkeit</Text>
              <Text className="text-purple-600">
                {item.isprivate ? "Nur für Sie sichtbar" : "Öffentlich sichtbar"}
              </Text>
            </div>
          </div>
        </div>
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={isDeleteModalOpen}
        type={"delete"}
        title="Item löschen"
        description="Bist du sicher, dass du dieses Item löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden."        
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          setIsDeleteModalOpen(false);
          handleDeleteItem();
        }}
      />
    </div>
  );
};

export default ItemDetailView;