import { useEffect, useState } from "react";
import {
  Card, Title, TextInput, Textarea, Button, Text, Dialog, DialogPanel, Flex, Badge
} from "@tremor/react";
import {
  SparklesIcon, ArrowLeftIcon, RectangleStackIcon, DocumentTextIcon, EyeIcon,
  LockClosedIcon, CheckCircleIcon, XCircleIcon, CalendarIcon, TagIcon, XMarkIcon,
  PhotoIcon, CloudArrowUpIcon
} from "@heroicons/react/24/outline";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";
import Item, { GalleryItem } from "interfaces/Item";
import { itemService } from "services/ItemService";
import { itemAssistantService } from "services/ItemAssistantService";
import NotyfService from "services/NotyfService";
import AlertDialog from "components/helper/AlertDialog";

type CreateItemListProps = {
  onNavigate: (route: string) => void;
};

export default function CreateItemList({ onNavigate }: CreateItemListProps) {
  // State variables for form fields and UI state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [userItems, setUserItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<GalleryItem[]>([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateConfirmOpen, setIsCreateConfirmOpen] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState("");

  // Fetch user's own items on mount
  useEffect(() => {
    const fetchUserItems = async () => {
      try {
        const allItems = await itemService.fetchOwnItems();
        setUserItems(allItems);
      } catch (err: any) {
        NotyfService.showError("Fehler beim Laden der Items.");
      }
    };
    fetchUserItems();
  }, []);

  // Handle main image file selection and preview
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMainImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove an item from the selected items list
  const removeItem = (itemId: number) => {
    setSelectedItems(prev => prev.filter(item => item.id !== itemId));
  };

  // Toggle selection of an item
  const toggleItemSelection = (itemId: number) => {
    const item = userItems.find(i => i.id === itemId);
    if (!item) return;

    const isSelected = selectedItems.some(selected => selected.id === itemId);
    if (isSelected) {
      removeItem(itemId);
    } else {
      // Convert Item to GalleryItem format
      const galleryItem: GalleryItem = {
        ...item,
        username: "You"
      };
      setSelectedItems(prev => [...prev, galleryItem]);
    }
  };

  // Submit the form to create a new item list
  const handleSubmit = async () => {
    if (!title.trim()) {
      NotyfService.showError("Listentitel ist erforderlich.");
      return;
    }

    if (selectedItems.length === 0) {
      NotyfService.showError("Bitte wählen Sie mindestens ein Item aus.");
      return;
    }

    try {
      await itemService.createItemList({
        title: title,
        description: description,
        item_ids: selectedItems.map(item => item.id),
        is_private: isPrivate,
        main_image: mainImageFile || undefined,
      });
      NotyfService.showSuccess("Liste erfolgreich erstellt.");
      onNavigate("/item-list");
      setTitle("");
      setDescription("");
      setSelectedItems([]);
      setIsPrivate(false);
      setMainImageFile(null);
      setMainImagePreview(null);
    } catch (err: any) {
      NotyfService.showError(err.message || "Fehler beim Erstellen der Liste.");
    }
  };

  // Generate a description using AI based on title and selected items
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
      const generatedText = await itemAssistantService.generateItemListDescription(
        title,
        selectedItems
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

  // Accept the generated description and set it as the description
  const handleAcceptDescription = () => {
    setDescription(generatedDescription);
    setIsDialogOpen(false);
  };

  // Check if form has required changes to enable submit
  const hasChanges = title.trim() && selectedItems.length > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
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

      {/* Hero header with gradient background */}
      <div className="relative bg-gradient-to-r from-green-600 via-blue-600 to-indigo-600 rounded-2xl overflow-hidden shadow-2xl">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 right-8 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute bottom-4 left-8 w-16 h-16 bg-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white rounded-full"></div>
        </div>

        <div className="relative p-8 text-white">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <RectangleStackIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <Title className="text-3xl font-bold text-white">Neue Item-Liste erstellen</Title>
              <Text className="text-blue-100 text-lg">
                Erstellen Sie Ihre persönliche Sammlung aus Ihren eigenen Items
              </Text>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main form section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Basic information (title, description, AI description) */}
          <Card>
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                <Title className="text-xl">Grundinformationen</Title>
              </div>

              <div className="space-y-4">
                {/* Title input */}
                <div>
                  <Text className="font-medium mb-2 text-gray-700">Listentitel *</Text>
                  <TextInput
                    placeholder="Geben Sie einen aussagekräftigen Titel ein"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Description input and AI description button/tooltip */}
                <div>
                  <TooltipProvider>
                    <div className="flex items-center justify-between mb-2">
                      <Text className="font-medium text-gray-700">Beschreibung</Text>
                      {selectedItems.length === 0 || !title.trim() ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
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
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs p-4 bg-white border border-gray-200 shadow-lg rounded-lg">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 mt-0.5">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <div className="text-sm">
                                <p className="font-medium text-gray-800 mb-1">Fehlende Informationen</p>
                                <p className="text-gray-600 leading-relaxed">
                                  {selectedItems.length === 0 && !title.trim()
                                    ? "Bitte fülle den Titel aus und wähle mindestens ein Item aus, um eine KI-Beschreibung zu generieren."
                                    : selectedItems.length === 0
                                      ? "Bitte wähle mindestens ein Item aus, um eine KI-Beschreibung zu generieren."
                                      : "Bitte fülle den Titel aus, um eine KI-Beschreibung zu generieren."
                                  }
                                </p>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
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
                      )}
                    </div>
                  </TooltipProvider>
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

          {/* Card: Main image upload and preview */}
          <Card>
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <PhotoIcon className="w-6 h-6 text-purple-600" />
                <Title className="text-xl">Banner-Bild hochladen</Title>
              </div>

              <div className="space-y-4">
                {/* File input for banner image */}
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageChange}
                    className="hidden"
                    id="main-image-upload"
                  />
                  <label
                    htmlFor="main-image-upload"
                    className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
                      mainImageFile 
                        ? 'border-green-400 bg-green-50 hover:bg-green-100' 
                        : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'
                    }`}
                  >
                    <CloudArrowUpIcon className={`w-12 h-12 mb-3 ${
                      mainImageFile ? 'text-green-500' : 'text-gray-400'
                    }`} />
                    <Text className={`text-sm text-center font-medium ${
                      mainImageFile ? 'text-green-700' : 'text-gray-600'
                    }`}>
                      {mainImageFile ? "Banner-Bild erfolgreich hochgeladen!" : "Klicken oder Dateien hierher ziehen"}
                    </Text>
                    <Text className="text-xs text-gray-500 mt-1">
                      PNG, JPG, GIF bis 10MB (optional)
                    </Text>
                  </label>
                </div>

                {/* Banner image preview */}
                {mainImagePreview && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Text className="text-sm font-medium text-gray-700">Banner-Vorschau:</Text>
                      <Badge color="green" icon={CheckCircleIcon} size="xs">
                        Geladen
                      </Badge>
                    </div>
                    
                    {/* Live banner preview */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Text className="text-xs text-gray-500">So wird es als Banner dargestellt:</Text>
                      </div>
                      <div className="relative h-64 w-full overflow-hidden rounded-lg border-2 border-blue-200 shadow-lg">
                        <img
                          src={mainImagePreview}
                          alt="Banner Vorschau"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40"></div>
                        <div className="absolute bottom-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          Live Banner
                        </div>
                      </div>
                    </div>

                    {/* Info box about banner */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <Text className="text-xs text-blue-800 font-medium mb-1">ℹ️ Banner-Info</Text>
                      <Text className="text-xs text-blue-700 leading-relaxed">
                        Das Banner hat eine variable Größe und wird automatisch an der Bildschirmgröße zugeschnitten und zentriert.
                      </Text>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Card: Privacy settings */}
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

              {/* Toggle for private/public list */}
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

          {/* Card: Select own items for the list */}
          <Card>
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <RectangleStackIcon className="w-6 h-6 text-green-600" />
                <div>
                  <Title className="text-xl">Ihre Items auswählen</Title>
                  <Text className="text-gray-600">Wählen Sie aus Ihren eigenen Items für diese Liste</Text>
                </div>
              </div>

              {/* Show message if no items exist, else show selectable list */}
              {userItems.length === 0 ? (
                <div className="text-center py-8">
                  <RectangleStackIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <Text className="text-gray-500 font-medium mb-2">Keine eigenen Items vorhanden</Text>
                  <Text className="text-gray-400 mb-4">
                    Sie müssen zuerst Items erstellen, bevor Sie eine Liste erstellen können.
                  </Text>
                  <Button
                    onClick={() => onNavigate('/items/create')}
                    color="blue"
                  >
                    Erstes Item erstellen
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
                        {/* Item image */}
                        <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        {/* Item details */}
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
                        {/* Privacy badge */}
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

        {/* Status and preview section */}
        <div className="space-y-6">
          {/* Card: Status checklist */}
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
                  <Text className="text-sm">Banner-Bild hochgeladen</Text>
                  {mainImageFile ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircleIcon className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Card: Preview of selected items */}
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

          {/* Action buttons: create and cancel */}
          <div className="space-y-3">
            <Button 
              color="blue" 
              onClick={() => setIsCreateConfirmOpen(true)} 
              size="lg" 
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 border-0"
              disabled={!hasChanges}
            >
              Liste erstellen
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

      {/* Dialog: Show AI-generated description */}
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

      {/* Dialog: Confirm creation of the list */}
      <AlertDialog
        open={isCreateConfirmOpen}
        type={"create"}
        title="Item-Liste erstellen"
        description="Bist du sicher, dass du diese neue Liste mit deinen ausgewählten Items erstellen möchtest?"
        onClose={() => setIsCreateConfirmOpen(false)}
        onConfirm={() => {
          setIsCreateConfirmOpen(false);
          handleSubmit();
        }}
      />
    </div>
  );
}