import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Title, Text, Button, Subtitle, Grid, Dialog, DialogPanel, Flex, Badge } from "@tremor/react";
import { UserIcon, TrashIcon, LockClosedIcon, EyeIcon, CalendarIcon, PencilIcon, ArrowLeftIcon, RectangleStackIcon, TagIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { GalleryItem } from "interfaces/Item";
import ItemList from "interfaces/ItemList";
import { itemService } from "services/ItemService";
import NotyfService from "services/NotyfService";
import { userService } from "services/UserService";
import Loading from "components/helper/Loading";
import AlertDialog from "components/helper/AlertDialog";

type ItemListDetailViewProps = {
  onNavigate: (route: string) => void;
};

const ItemListDetailView = ({ onNavigate }: ItemListDetailViewProps) => {
  // Get list id from route params and initialize state
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [list, setList] = useState<ItemList | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch item list and its items on mount or when id changes
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

  // Handle deletion of the item list
  const handleDeleteItemList = async () => {
    if (list) {
      try {
        await itemService.deleteItemList(list.id);
        NotyfService.showSuccess("Item List erfolgreich gelöscht");
        setIsDeleteModalOpen(false);
        onNavigate("/item-list");
      } catch (error) {
        let errorMessage = "Fehler beim Löschen der Item List";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        NotyfService.showError(errorMessage);
      }
    }
  };

  if (isLoading) return <Loading />;

  // Check if current user is the owner of the list
  const isOwner = list?.user_id === userService.getUserID();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Back navigation button */}
      <div className="flex items-center mb-6">
        <Button
          variant="light"
          icon={ArrowLeftIcon}
          onClick={() => onNavigate("/item-list")}
          className="mr-4"
        >
          Zurück zu den Listen
        </Button>
      </div>

      <Card className="overflow-hidden">
        {/* Header image or placeholder */}
        <div className="relative w-full h-72 bg-gray-100 border-b-2 border-gray-200">
          {list?.main_image ? (
            <img
              src={list.main_image}
              alt={list.title}
              className="w-full h-full object-cover"
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

        <div className="p-6 space-y-6">
          {/* List title and badges */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge color="blue" icon={RectangleStackIcon}>
                {items.length} {items.length === 1 ? "Item" : "Items"}
              </Badge>

              {list?.isprivate ? (
                <Badge color="red" icon={LockClosedIcon}>
                  Privat
                </Badge>
              ) : (
                <Badge color="green" icon={EyeIcon}>
                  Öffentlich
                </Badge>
              )}

              {isOwner && <Badge color="gray">Eigenes Item</Badge>}
            </div>

            <div>
              <Title className="text-3xl text-gray-900 mb-2 leading-tight">
                {list?.title}
              </Title>
            </div>
          </div>

          {/* Meta information: creation date */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center text-gray-600">
              <CalendarIcon className="w-5 h-5 mr-3 text-blue-500" />
              <Text className="font-medium">Erstellt am:</Text>
              <Text className="ml-2">
                {new Date(list?.entered_on ?? Date.now()).toLocaleDateString(
                  "de-DE",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  }
                )}
              </Text>
            </div>
          </div>

          {/* List description */}
          {list?.description && (
            <div className="space-y-2">
              <Title className="text-lg text-gray-800">Beschreibung</Title>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <Text className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {list.description}
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
                  onClick={() => onNavigate(`/item-list/${id}/edit`)}
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
      </Card>

      {/* Grid of items in the list */}
      {items.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Title className="text-xl text-gray-900">Enthaltene Items</Title>
            <Text className="text-gray-500">
              {items.length} {items.length === 1 ? "Item" : "Items"} in dieser
              Liste
            </Text>
          </div>

          <Grid className="gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <Card
                key={item.id}
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                onClick={() => onNavigate(`/items/${item.id}`)}
              >
                {/* Item image or placeholder */}
                <div className="aspect-square w-full overflow-hidden bg-gray-100 mb-4">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <PhotoIcon className="w-12 h-12 opacity-50" />
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-3">
                  {/* Item category and privacy badge */}
                  <div className="flex justify-between items-start">
                    {item.category && (
                      <Badge color="blue" icon={TagIcon} size="xs">
                        {item.category}
                      </Badge>
                    )}

                    {item.isprivate && (
                      <Badge color="red" icon={LockClosedIcon} size="xs">
                        Privat
                      </Badge>
                    )}
                  </div>

                  {/* Item title */}
                  <Title className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </Title>

                  {/* Item creation date */}
                  <Text className="text-xs text-gray-500 flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    {new Date(item.entered_on).toLocaleDateString("de-DE")}
                  </Text>

                  {/* Item author */}
                  <div className="flex items-center pt-2 border-t border-gray-100">
                    <UserIcon className="w-4 h-4 text-gray-400 mr-2" />
                    <Text className="text-sm text-gray-600 font-medium">
                      {item.username}
                    </Text>
                  </div>
                </div>
              </Card>
            ))}
          </Grid>
        </div>
      ) : (
        // Empty state if no items in the list
        <Card>
          <div className="text-center py-12">
            <RectangleStackIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <Title className="text-gray-500 mb-2">Keine Items in dieser Liste</Title>
            <Text className="text-gray-400">
              Diese Liste enthält noch keine Items.
            </Text>
            {isOwner && (
              <Button
                className="mt-4"
                onClick={() => onNavigate(`/item-list/${id}/edit`)}
                color="blue"
              >
                Items hinzufügen
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Delete confirmation dialog */}

      <AlertDialog
        open={isDeleteModalOpen}
        type={"delete"}
        title="Item-Liste löschen"
        description="Möchten Sie diese Item-Liste wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden."
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          setIsDeleteModalOpen(false);
          handleDeleteItemList();
        }}
      />
    </div>
  );
};

export default ItemListDetailView;
