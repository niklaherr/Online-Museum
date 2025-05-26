import React, { useEffect, useState } from "react";
import { Text, Button, Dialog, DialogPanel, Title, Flex, Card, Badge } from "@tremor/react";
import { 
  UserIcon, 
  PencilIcon, 
  TrashIcon, 
  CalendarIcon,
  TagIcon,
  LockClosedIcon,
  EyeIcon,
  ArrowLeftIcon
} from "@heroicons/react/24/outline";
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

  const isOwner = item.user_id == userService.getUserID();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Back Button */}
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

      {/* Main Content Card */}
      <Card className="overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          {/* Image Section */}
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

          {/* Content Section */}
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

            {/* Meta Information */}
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

            {/* Description */}
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

            {/* Action Buttons */}
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

      {/* Additional Information Card (wenn nötig für zukünftige Features) */}
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

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <DialogPanel className="max-w-md bg-white rounded-xl shadow-xl p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <TrashIcon className="h-6 w-6 text-red-600" />
            </div>
            
            <Title className="text-lg font-semibold text-gray-900 mb-2">
              Item wirklich löschen?
            </Title>
            
            <Text className="text-gray-500 mb-6">
              Diese Aktion kann nicht rückgängig gemacht werden. Das Item "{item.title}" wird permanent gelöscht.
            </Text>
            
            <Flex justifyContent="end" className="space-x-3">
              <Button 
                variant="secondary" 
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4"
              >
                Abbrechen
              </Button>
              <Button 
                color="red" 
                onClick={handleDeleteItem}
                className="px-4"
              >
                Ja, löschen
              </Button>
            </Flex>
          </div>
        </DialogPanel>
      </Dialog>
    </div>
  );
};

export default ItemDetailView;