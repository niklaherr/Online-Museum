import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Title,
  TextInput,
  Textarea,
  Button,
  Text,
  Dialog,
  DialogPanel,
  Flex,
  Badge,
} from "@tremor/react";
import { 
  SparklesIcon,
  ArrowLeftIcon,
  RectangleStackIcon,
  DocumentTextIcon,
  EyeIcon,
  LockClosedIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  CalendarIcon,
  TagIcon,
  XMarkIcon,
  PhotoIcon,
  CloudArrowUpIcon
} from "@heroicons/react/24/outline";
import Item, { GalleryItem } from "interfaces/Item";
import { itemService } from "services/ItemService";
import { itemAssistantService } from "services/ItemAssistantService";
import NotyfService from "services/NotyfService";
import Loading from "components/helper/Loading";

type EditItemListProps = {
  onNavigate: (route: string) => void;
};

export default function EditItemList({ onNavigate }: EditItemListProps) {
  const { id } = useParams<{ id: string }>();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [userItems, setUserItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<GalleryItem[]>([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Hero Image States
  const [currentHeroImage, setCurrentHeroImage] = useState<string | null>(null);
  const [newHeroImage, setNewHeroImage] = useState<File | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null);
  const [isHeroImageModalOpen, setIsHeroImageModalOpen] = useState(false);
  const [isUploadingHero, setIsUploadingHero] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateConfirmOpen, setIsUpdateConfirmOpen] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState("");

  useEffect(() => {
    const loadItemList = async () => {
      try {
        const [listDetails, listItems, allUserItems] = await Promise.all([
          itemService.fetchItemListById(id!),
          itemService.fetchItemsByItemListId(parseInt(id!)),
          itemService.fetchOwnItems(),
        ]);

        setTitle(listDetails.title);
        setDescription(listDetails.description || "");
        setIsPrivate(listDetails.isprivate ?? false);
        
        // Korrigierte Hero Image Ladung
        console.log("Loaded list details:", listDetails);
        console.log("Hero image from backend:", listDetails.hero_image);
        setCurrentHeroImage(listDetails.hero_image || null);
        
        setSelectedItems(listItems);
        setUserItems(allUserItems);
        setIsLoading(false);
      } catch (error) {
        let errorMessage = "Fehler beim Laden der Item-Liste";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        NotyfService.showError(errorMessage);
        setIsLoading(false);
      }
    };

    loadItemList();
  }, [id]);

  // Hero Image Handlers
  const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewHeroImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeroImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadHeroImage = async () => {
    if (!newHeroImage) {
      NotyfService.showError("Bitte wählen Sie ein Bild aus.");
      return;
    }

    setIsUploadingHero(true);
    try {
      console.log("Uploading hero image for list ID:", id);
      await itemService.uploadHeroImage(parseInt(id!), newHeroImage);
      NotyfService.showSuccess("Hauptbild erfolgreich hochgeladen");
      
      // Reload the list to get updated hero image
      const updatedList = await itemService.fetchItemListById(id!);
      console.log("Updated list after upload:", updatedList);
      setCurrentHeroImage(updatedList.hero_image || null);
      
      // Close modal and reset state
      setIsHeroImageModalOpen(false);
      setNewHeroImage(null);
      setHeroImagePreview(null);
    } catch (error) {
      let errorMessage = "Fehler beim Hochladen des Hauptbildes";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error("Hero image upload error:", error);
      NotyfService.showError(errorMessage);
    } finally {
      setIsUploadingHero(false);
    }
  };

  const handleDeleteHeroImage = async () => {
    if (!id) {
      NotyfService.showError("Keine Liste-ID gefunden.");
      return;
    }

    try {
      console.log("Deleting hero image for list ID:", id);
      await itemService.deleteHeroImage(parseInt(id));
      NotyfService.showSuccess("Hauptbild erfolgreich entfernt");
      setCurrentHeroImage(null);
    } catch (error) {
      let errorMessage = "Fehler beim Entfernen des Hauptbildes";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error("Hero image delete error:", error);
      NotyfService.showError(errorMessage);
    }
  };

  // Remove item from selection
  const removeItem = (itemId: number) => {
    setSelectedItems(prev => prev.filter(item => item.id !== itemId));
  };

  const toggleItemSelection = (itemId: number) => {
    const item = userItems.find(i => i.id === itemId);
    if (!item) return;

    const isSelected = selectedItems.some(selected => selected.id === itemId);
    if (isSelected) {
      removeItem(itemId);
    } else {
      const galleryItem: GalleryItem = {
        ...item,
        username: "You"
      };
      setSelectedItems(prev => [...prev, galleryItem]);
    }
  };

  const handleUpdate = async () => {
    if (!title.trim()) {
      NotyfService.showError("Listentitel ist erforderlich.");
      return;
    }

    if (selectedItems.length === 0) {
      NotyfService.showError("Bitte wählen Sie mindestens ein Item aus.");
      return;
    }

    try {
      await itemService.editItemList(parseInt(id!), {
        title,
        description,
        item_ids: selectedItems.map(item => item.id),
        is_private: isPrivate,
      });
      NotyfService.showSuccess("Liste erfolgreich aktualisiert.");
      onNavigate("/item-list");
    } catch (error: any) {
      NotyfService.showError(
        error.message || "Fehler beim Aktualisieren der Liste."
      );
    }
  };

  const handleGenerateDescription = async () => {
    if (!title.trim()) {
      NotyfService.showError("Bitte gib zuerst einen Titel ein.");
      return;
    }

    if (selectedItems.length === 0) {
      NotyfService.showError("Bitte wähle zuerst mindestens ein Item aus.");
      return;
    }

    setIsGenerating(true);

    try {
      let promptText = `Erstelle eine ansprechende Beschreibung für eine Sammlung mit dem Titel "${title}". `;
      promptText += "Die Sammlung enthält folgende Elemente:\n";

      selectedItems.forEach((item) => {
        promptText += `- ${item.title}`;
        if (item.category) promptText += ` (Kategorie: ${item.category})`;
        if (item.description) promptText += `: ${item.description}`;
        promptText += "\n";
      });

      promptText +=
        "\nBitte erstelle basierend auf diesen Informationen eine zusammenfassende Beschreibung, die die Einzigartigkeit dieser Sammlung in 2-3 Sätzen hervorhebt.";

      const generatedText = await itemAssistantService.generateDescription(
        title,
        promptText
      );
      setGeneratedDescription(generatedText);
      setIsDialogOpen(true);
      NotyfService.showSuccess("Beschreibung erfolgreich generiert.");
    } catch (err) {
      console.error("Fehler bei der Generierung:", err);
      NotyfService.showError("Fehler bei der Generierung der Beschreibung.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAcceptDescription = () => {
    setDescription(generatedDescription);
    setIsDialogOpen(false);
  };

  if (isLoading) return <Loading />;

  const hasChanges = title.trim() && selectedItems.length > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
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

      {/* Hero Header with Current Hero Image */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl min-h-[200px]">
        {/* Hero Image Background (if exists) */}
        {currentHeroImage ? (
          <>
            <img
              src={currentHeroImage}
              alt={title || "Hauptbild"}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
          </>
        ) : (
          <div className="bg-gradient-to-r from-green-600 via-blue-600 to-indigo-600 min-h-[200px] relative">
            {/* Background Pattern (when no hero image) */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-8 right-8 w-24 h-24 bg-white rounded-full"></div>
              <div className="absolute bottom-4 left-8 w-16 h-16 bg-white rounded-full"></div>
              <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white rounded-full"></div>
            </div>
          </div>
        )}
        
        <div className="relative p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <RectangleStackIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <Title className="text-3xl font-bold text-white">Item-Liste bearbeiten</Title>
                <Text className="text-blue-100 text-lg">
                  Aktualisieren Sie Ihre persönliche Sammlung aus Ihren eigenen Items
                </Text>
              </div>
            </div>
            
            {/* Hero Image Management Buttons */}
            <div className="flex space-x-2">
              <Button
                icon={PhotoIcon}
                size="sm"
                onClick={() => setIsHeroImageModalOpen(true)}
                className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border-0"
              >
                {currentHeroImage ? 'Bild ändern' : 'Hauptbild hinzufügen'}
              </Button>
              {currentHeroImage && (
                <Button
                  icon={XMarkIcon}
                  size="sm"
                  variant="light"
                  onClick={handleDeleteHeroImage}
                  className="bg-white/20 backdrop-blur-sm text-white hover:bg-red-500/30 border-0"
                >
                  Bild entfernen
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information Card */}
          <Card>
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                <Title className="text-xl">Grundinformationen</Title>
              </div>

              <div className="space-y-4">
                <div>
                  <Text className="font-medium mb-2 text-gray-700">Listentitel *</Text>
                  <TextInput
                    placeholder="Geben Sie einen aussagekräftigen Titel ein"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Text className="font-medium text-gray-700">Beschreibung</Text>
                    <Button
                      icon={SparklesIcon}
                      size="xs"
                      color="blue"
                      onClick={handleGenerateDescription}
                      loading={isGenerating}
                      disabled={selectedItems.length === 0 || !title.trim()}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 border-0 text-white"
                    >
                      KI-Beschreibung
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Beschreibung (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Privacy Settings Card */}
          <Card>
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                {isPrivate ? (
                  <LockClosedIcon className="w-6 h-6 text-red-600" />
                ) : (
                  <EyeIcon className="w-6 h-6 text-green-600" />
                )}
                <Title className="text-xl">Sichtbarkeitseinstellungen</Title>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${isPrivate ? 'bg-red-100' : 'bg-green-100'}`}>
                    {isPrivate ? (
                      <LockClosedIcon className="w-5 h-5 text-red-600" />
                    ) : (
                      <EyeIcon className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <div>
                    <Text className="font-medium">
                      {isPrivate ? "Private Liste" : "Öffentliche Liste"}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {isPrivate 
                        ? "Nur Sie können diese Liste sehen" 
                        : "Alle Benutzer können diese Liste sehen"
                      }
                    </Text>
                  </div>
                </div>
                
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isPrivate}
                    onChange={() => setIsPrivate(!isPrivate)}
                  />
                  <div className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                    isPrivate ? 'bg-red-500' : 'bg-green-500'
                  }`}>
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                      isPrivate ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </div>
                </label>
              </div>
            </div>
          </Card>

          {/* Own Items Selection Card */}
          <Card>
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <RectangleStackIcon className="w-6 h-6 text-green-600" />
                <div>
                  <Title className="text-xl">Ihre Items auswählen</Title>
                  <Text className="text-gray-600">Wählen Sie aus Ihren eigenen Items für diese Liste</Text>
                </div>
              </div>

              {userItems.length === 0 ? (
                <div className="text-center py-8">
                  <RectangleStackIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <Text className="text-gray-500 font-medium mb-2">Keine eigenen Items vorhanden</Text>
                  <Text className="text-gray-400 mb-4">
                    Sie müssen zuerst Items erstellen, bevor Sie sie zu Listen hinzufügen können.
                  </Text>
                  <Button
                    onClick={() => onNavigate('/items/create')}
                    color="blue"
                  >
                    Neues Item erstellen
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {userItems.map((item) => {
                    const isSelected = selectedItems.some(selected => selected.id === item.id);
                    return (
                      <div key={item.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg border border-gray-100">
                        <input
                          type="checkbox"
                          id={`item-${item.id}`}
                          checked={isSelected}
                          onChange={() => toggleItemSelection(item.id)}
                          className="rounded text-blue-500 focus:ring-blue-500"
                        />
                        
                        {/* Item Image */}
                        <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        
                        {/* Item Details */}
                        <label htmlFor={`item-${item.id}`} className="flex-1 cursor-pointer">
                          <Text className="font-medium">{item.title}</Text>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            {item.category && (
                              <>
                                <TagIcon className="w-3 h-3" />
                                <span>{item.category}</span>
                                <span>•</span>
                              </>
                            )}
                            <CalendarIcon className="w-3 h-3" />
                            <span>{new Date(item.entered_on).toLocaleDateString()}</span>
                          </div>
                        </label>
                        
                        {/* Privacy Badge */}
                        <div className="flex-shrink-0">
                          {item.isprivate ? (
                            <Badge color="red" icon={LockClosedIcon} size="xs">
                              Privat
                            </Badge>
                          ) : (
                            <Badge color="green" icon={EyeIcon} size="xs">
                              Öffentlich
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Status/Preview Section */}
        <div className="space-y-6">
          {/* Current Hero Image Preview */}
          {currentHeroImage && (
            <Card>
              <div className="p-6 space-y-4">
                <Title className="text-lg">Aktuelles Hauptbild</Title>
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-gray-200">
                  <img
                    src={currentHeroImage}
                    alt="Hauptbild"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="light"
                    color="blue"
                    onClick={() => setIsHeroImageModalOpen(true)}
                    className="flex-1"
                  >
                    Ändern
                  </Button>
                  <Button
                    size="sm"
                    variant="light"
                    color="red"
                    onClick={handleDeleteHeroImage}
                    className="flex-1"
                  >
                    Entfernen
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Status Card */}
          <Card>
            <div className="p-6 space-y-4">
              <Title className="text-lg">Status</Title>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Text className="text-sm">Titel ausgefüllt</Text>
                  {title.trim() ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircleIcon className="w-5 h-5 text-red-500" />
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <Text className="text-sm">Items ausgewählt</Text>
                  {selectedItems.length > 0 ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircleIcon className="w-5 h-5 text-red-500" />
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <Text className="text-sm">Beschreibung vorhanden</Text>
                  {description.trim() ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircleIcon className="w-5 h-5 text-gray-400" />
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Text className="text-sm">Hauptbild vorhanden</Text>
                  {currentHeroImage ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircleIcon className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Selected Items Preview */}
          <Card>
            <div className="p-6 space-y-4">
              <Title className="text-lg">Ausgewählte Items ({selectedItems.length})</Title>
              
              {selectedItems.length === 0 ? (
                <Text className="text-gray-500 italic text-center py-4">
                  Keine Items ausgewählt
                </Text>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2 min-w-0">
                        <div className="w-8 h-8 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <Text className="text-sm font-medium truncate">{item.title}</Text>
                          <Text className="text-xs text-gray-500 truncate">
                            {item.category}
                          </Text>
                        </div>
                      </div>
                      <Button
                        icon={XMarkIcon}
                        variant="light"
                        color="red"
                        size="xs"
                        onClick={() => removeItem(item.id)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              color="blue" 
              onClick={() => setIsUpdateConfirmOpen(true)} 
              size="lg" 
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 border-0"
              disabled={!hasChanges}
            >
              Änderungen speichern
            </Button>
            
            <Button
              variant="light"
              onClick={() => onNavigate("/item-list")}
              className="w-full"
            >
              Abbrechen
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Image Upload Modal */}
      <Dialog open={isHeroImageModalOpen} onClose={() => setIsHeroImageModalOpen(false)} static={true}>
        <DialogPanel className="max-w-2xl">
          <div className="p-6 space-y-6">
            <div className="flex items-center space-x-3">
              <PhotoIcon className="w-8 h-8 text-blue-600" />
              <Title className="text-xl">Hauptbild {currentHeroImage ? 'ändern' : 'hinzufügen'}</Title>
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
                    {newHeroImage ? "Bild erfolgreich ausgewählt!" : "Klicken oder Dateien hierher ziehen"}
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
                  setNewHeroImage(null);
                  setHeroImagePreview(null);
                }}
              >
                Abbrechen
              </Button>
              <Button 
                color="blue" 
                onClick={handleUploadHeroImage}
                disabled={!newHeroImage}
                loading={isUploadingHero}
              >
                {isUploadingHero ? "Wird hochgeladen..." : "Hauptbild speichern"}
              </Button>
            </Flex>
          </div>
        </DialogPanel>
      </Dialog>

      {/* AI Description Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} static={true}>
        <DialogPanel className="max-w-2xl">
          <div className="p-6 space-y-6">
            <div className="flex items-center space-x-3">
              <SparklesIcon className="w-8 h-8 text-blue-600" />
              <Title className="text-xl">KI-generierte Beschreibung</Title>
            </div>

            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <Text className="leading-relaxed">{generatedDescription}</Text>
            </div>

            <Flex justifyContent="end" className="space-x-3">
              <Button
                color="gray"
                onClick={() => {
                  setIsDialogOpen(false);
                  handleGenerateDescription();
                }}
              >
                Neu generieren
              </Button>
              <Button 
                color="blue" 
                onClick={handleAcceptDescription}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0"
              >
                Übernehmen
              </Button>
            </Flex>
          </div>
        </DialogPanel>
      </Dialog>

      {/* Update Confirmation Dialog */}
      <Dialog open={isUpdateConfirmOpen} onClose={() => setIsUpdateConfirmOpen(false)}>
        <DialogPanel className="max-w-md bg-white rounded-xl shadow-xl p-6">
          <div className="text-center space-y-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
              <CheckCircleIcon className="h-6 w-6 text-blue-600" />
            </div>
            
            <Title className="text-lg font-semibold text-gray-900">
              Änderungen speichern?
            </Title>
            
            <Text className="text-gray-500">
              Bist du sicher, dass du die Änderungen an dieser Liste mit {selectedItems.length} eigenen Items speichern möchtest?
            </Text>
            
            <Flex justifyContent="end" className="space-x-3 pt-4">
              <Button variant="secondary" onClick={() => setIsUpdateConfirmOpen(false)}>
                Abbrechen
              </Button>
              <Button
                color="blue"
                onClick={() => {
                  setIsUpdateConfirmOpen(false);
                  handleUpdate();
                }}
                className="bg-gradient-to-r from-green-600 to-blue-600 border-0"
              >
                Ja, speichern
              </Button>
            </Flex>
          </div>
        </DialogPanel>
      </Dialog>
    </div>
  );
}