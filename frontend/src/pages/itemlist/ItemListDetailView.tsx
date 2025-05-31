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
  PhotoIcon,
  CloudArrowUpIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { GalleryItem } from "interfaces/Item";
import ItemList from "interfaces/ItemList";
import { itemService } from "services/ItemService";
import NotyfService from "services/NotyfService";
import { userService } from "services/UserService";
import NoResults from "components/helper/NoResults";
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
  const [isHeroImageModalOpen, setIsHeroImageModalOpen] = useState(false);
  const [selectedHeroImage, setSelectedHeroImage] = useState<File | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null);
  const [isUploadingHero, setIsUploadingHero] = useState(false);

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

  const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedHeroImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeroImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadHeroImage = async () => {
    if (!selectedHeroImage || !list) return;

    setIsUploadingHero(true);
    try {
      await itemService.uploadHeroImage(list.id, selectedHeroImage);
      NotyfService.showSuccess("Hauptbild erfolgreich hochgeladen");
      
      // Reload the list to get the updated hero image
      const updatedList = await itemService.fetchItemListById(id!);
      setList(updatedList);
      
      // Close modal and reset state
      setIsHeroImageModalOpen(false);
      setSelectedHeroImage(null);
      setHeroImagePreview(null);
    } catch (error) {
      let errorMessage = "Fehler beim Hochladen des Hauptbildes";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      NotyfService.showError(errorMessage);
    } finally {
      setIsUploadingHero(false);
    }
  };

  const handleDeleteHeroImage = async () => {
    if (!list) return;

    try {
      await itemService.deleteHeroImage(list.id);
      NotyfService.showSuccess("Hauptbild erfolgreich entfernt");
      
      // Reload the list to get the updated state
      const updatedList = await itemService.fetchItemListById(id!);
      setList(updatedList);
    } catch (error) {
      let errorMessage = "Fehler beim Entfernen des Hauptbildes";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      NotyfService.showError(errorMessage);
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

      {/* Header Card with Hero Image */}
      <Card className="relative overflow-hidden">
        {/* Hero Image or Gradient Background */}
        <div className="relative h-80 w-full overflow-hidden">
          {list?.hero_image ? (
            <>
              {/* Hero Image */}
              <img
                src={list.hero_image}
                alt={list.title}
                className="w-full h-full object-cover"
              />
              {/* Dark overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            </>
          ) : (
            <>
              {/* Fallback Gradient Background */}
              <div className="w-full h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-8 right-8 w-32 h-32 bg-blue-200 rounded-full"></div>
                  <div className="absolute bottom-8 left-8 w-24 h-24 bg-purple-200 rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-indigo-200 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>
                
                {/* Center Icon */}
                <div className="relative z-10 flex items-center justify-center h-full">
                  <div className="p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl">
                    <RectangleStackIcon className="w-20 h-20 text-indigo-600" />
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            </>
          )}

          {/* Hero Image Management Button (für Owner) */}
          {isOwner && (
            <div className="absolute top-4 right-4">
              <div className="flex space-x-2">
                <Button
                  icon={PhotoIcon}
                  size="xs"
                  onClick={() => setIsHeroImageModalOpen(true)}
                  className="bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white border-0 shadow-lg"
                >
                  {list?.hero_image ? 'Bild ändern' : 'Bild hinzufügen'}
                </Button>
                {list?.hero_image && (
                  <Button
                    icon={XMarkIcon}
                    size="xs"
                    variant="light"
                    color="red"
                    onClick={handleDeleteHeroImage}
                    className="bg-white/90 backdrop-blur-sm hover:bg-red-50 border-0 shadow-lg"
                  >
                    Entfernen
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="flex-1 space-y-4">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <Badge color="blue" icon={RectangleStackIcon} className="bg-white/90 backdrop-blur-sm shadow-lg">
                    {items.length} {items.length === 1 ? "Item" : "Items"}
                  </Badge>
                  
                  {list?.isprivate ? (
                    <Badge color="red" icon={LockClosedIcon} className="bg-white/90 backdrop-blur-sm shadow-lg">
                      Privat
                    </Badge>
                  ) : (
                    <Badge color="green" icon={EyeIcon} className="bg-white/90 backdrop-blur-sm shadow-lg">
                      Öffentlich
                    </Badge>
                  )}

                  {isOwner && (
                    <Badge color="gray" className="bg-white/90 backdrop-blur-sm shadow-lg">
                      Eigene Liste
                    </Badge>
                  )}
                </div>

                {/* Title & Description */}
                <div className="space-y-3">
                  <Title className="text-4xl font-bold text-white leading-tight drop-shadow-lg">
                    {list?.title}
                  </Title>
                  
                  {list?.description && (
                    <Subtitle className="text-xl text-white/90 leading-relaxed max-w-3xl drop-shadow-md">
                      {list.description}
                    </Subtitle>
                  )}
                </div>

                {/* Meta Info */}
                <div className="flex items-center text-white/80 space-x-4">
                  <div className="flex items-center">
                    <CalendarIcon className="w-5 h-5 mr-2" />
                    <Text className="font-medium text-white/90">
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
                    className="bg-white/90 backdrop-blur-sm text-blue-600 hover:bg-white border-0 shadow-lg"
                  >
                    Bearbeiten
                  </Button>
                  
                  <Button
                    variant="light"
                    color="red"
                    icon={TrashIcon}
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="bg-white/90 backdrop-blur-sm hover:bg-red-50 border-0 shadow-lg"
                  >
                    Löschen
                  </Button>
                </div>
              )}
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
                      <EyeIcon className="w-12 h-12 opacity-50" />
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

      {/* Hero Image Upload Modal */}
      <Dialog open={isHeroImageModalOpen} onClose={() => setIsHeroImageModalOpen(false)} static={true}>
        <DialogPanel className="max-w-2xl">
          <div className="p-6 space-y-6">
            <div className="flex items-center space-x-3">
              <PhotoIcon className="w-8 h-8 text-blue-600" />
              <Title className="text-xl">Hauptbild {list?.hero_image ? 'ändern' : 'hinzufügen'}</Title>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeroImageChange}
                  className="hidden"
                  id="hero-image-upload"
                />
                <label
                  htmlFor="hero-image-upload"
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200"
                >
                  <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mb-3" />
                  <Text className="text-sm text-gray-600 text-center font-medium">
                    {selectedHeroImage ? "Bild erfolgreich ausgewählt!" : "Klicken oder Dateien hierher ziehen"}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF bis 10MB
                  </Text>
                </label>
              </div>

              {/* Image Preview */}
              {heroImagePreview && (
                <div className="space-y-2">
                  <Text className="text-sm font-medium text-gray-700">Vorschau:</Text>
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-green-200 shadow-lg">
                    <img
                      src={heroImagePreview}
                      alt="Vorschau"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            <Flex justifyContent="end" className="space-x-3">
              <Button 
                variant="secondary" 
                onClick={() => {
                  setIsHeroImageModalOpen(false);
                  setSelectedHeroImage(null);
                  setHeroImagePreview(null);
                }}
              >
                Abbrechen
              </Button>
              <Button 
                color="blue" 
                onClick={handleUploadHeroImage}
                disabled={!selectedHeroImage}
                loading={isUploadingHero}
              >
                {isUploadingHero ? "Wird hochgeladen..." : "Hauptbild speichern"}
              </Button>
            </Flex>
          </div>
        </DialogPanel>
      </Dialog>

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