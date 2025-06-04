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
  Flex,
  Badge
} from "@tremor/react";
import { 
  UserIcon, 
  TrashIcon, 
  LockClosedIcon, 
  EyeIcon,
  CalendarIcon,
  PencilIcon,
  ArrowLeftIcon,
  RectangleStackIcon,
  TagIcon,
  PhotoIcon
} from "@heroicons/react/24/outline";
import { GalleryItem } from "interfaces/Item";
import ItemList from "interfaces/ItemList";
import { itemService } from "services/ItemService";
import NotyfService from "services/NotyfService";
import { userService } from "services/UserService";
import Loading from "components/helper/Loading";

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
        onNavigate('/item-list'); 
      } catch (error) {
        let errorMessage = "Fehler beim Löschen der Item List";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        NotyfService.showError(errorMessage);
      }
    }
  };

  if (isLoading) return <Loading />

  const isOwner = list?.user_id === userService.getUserID();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Back Button */}
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

      {/* Header Card */}
      <Card className="relative overflow-hidden rounded-xl">
        {/* Background with main image or gradient */}
        <div className="relative h-64 w-full overflow-hidden rounded-xl">
          {list?.main_image ? (
            <>
              <img
                src={list.main_image}
                alt={list.title}
                className="w-full h-full object-cover"
              />
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-black/40"></div>
            </>
          ) : (
            <>
              {/* Gradient Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-200/20 rounded-full translate-y-12 -translate-x-12"></div>
            </>
          )}
          
          {/* Content overlay */}
          <div className="absolute inset-0 flex items-end">
            <div className="p-8 w-full">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                <div className="flex-1 space-y-4">
                  {/* Badges */}
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

                    {isOwner && (
                      <Badge color="gray">
                        Eigene Liste
                      </Badge>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-3">
                    <Title className={`text-3xl leading-tight ${list?.main_image ? 'text-white' : 'text-blue-900'}`}>
                      {list?.title}
                    </Title>
                    
                    {list?.description && (
                      <Subtitle className={`text-lg leading-relaxed max-w-3xl ${list?.main_image ? 'text-blue-100' : 'text-blue-700'}`}>
                        {list.description}
                      </Subtitle>
                    )}
                  </div>

                  {/* Meta Info */}
                  <div className={`flex items-center space-x-4 ${list?.main_image ? 'text-blue-200' : 'text-blue-600'}`}>
                    <div className="flex items-center">
                      <CalendarIcon className="w-5 h-5 mr-2" />
                      <Text className={`font-medium ${list?.main_image ? 'text-blue-200' : 'text-blue-600'}`}>
                        Erstellt am {list ? new Date(list.entered_on).toLocaleDateString('de-DE', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : "/"}
                      </Text>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {isOwner && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      icon={PencilIcon}
                      onClick={() => onNavigate(`/item-list/${id}/edit`)}
                      color="blue"
                    >
                      Bearbeiten
                    </Button>
                    
                    <Button
                      variant="light"
                      color="red"
                      icon={TrashIcon}
                      onClick={() => setIsDeleteModalOpen(true)}
                    >
                      Löschen
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Items Grid */}
      {items.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Title className="text-xl text-gray-900">Enthaltene Items</Title>
            <Text className="text-gray-500">
              {items.length} {items.length === 1 ? "Item" : "Items"} in dieser Liste
            </Text>
          </div>

          <Grid className="gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <Card
                key={item.id}
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                onClick={() => onNavigate(`/items/${item.id}`)}
              >
                {/* Image */}
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

                {/* Content */}
                <div className="p-4 space-y-3">
                  {/* Category & Privacy Badge */}
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

                  {/* Title */}
                  <Title className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </Title>

                  {/* Date */}
                  <Text className="text-xs text-gray-500 flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    {new Date(item.entered_on).toLocaleDateString('de-DE')}
                  </Text>

                  {/* Author */}
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

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <DialogPanel className="max-w-md bg-white rounded-xl shadow-xl p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <TrashIcon className="h-6 w-6 text-red-600" />
            </div>
            
            <Title className="text-lg font-semibold text-gray-900 mb-2">
              Liste wirklich löschen?
            </Title>
            
            <Text className="text-gray-500 mb-6">
              Diese Aktion kann nicht rückgängig gemacht werden. Die Liste "{list?.title}" wird permanent gelöscht.
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
                onClick={handleDeleteItemList}
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

export default ItemListDetailView;