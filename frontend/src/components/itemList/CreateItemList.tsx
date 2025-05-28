import { useEffect, useState } from "react";
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
  Grid,
  Badge,
} from "@tremor/react";
import { 
  SparklesIcon,
  ArrowLeftIcon,
  RectangleStackIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  XMarkIcon,
  DocumentTextIcon,
  EyeIcon,
  LockClosedIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  CalendarIcon,
  TagIcon
} from "@heroicons/react/24/outline";
import Item, { GalleryItem } from "interfaces/Item";
import { itemService } from "services/ItemService";
import { itemAssistantService } from "services/ItemAssistantService";
import NotyfService from "services/NotyfService";

type CreateItemListProps = {
  onNavigate: (route: string) => void;
};

export default function CreateItemList({ onNavigate }: CreateItemListProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [userItems, setUserItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<GalleryItem[]>([]);
  const [isPrivate, setIsPrivate] = useState(false);

  // Search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GalleryItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateConfirmOpen, setIsCreateConfirmOpen] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState("");

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

  // Search for items (including other users' public items)
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      // Get all public items from other users
      const allPublicItems = await itemService.fetchItemsNotOwnedByUser();
      
      // Filter based on search query
      const filteredResults = allPublicItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      // Filter out items that are already selected
      const selectedItemIds = selectedItems.map(item => item.id);
      const finalResults = filteredResults.filter(item => !selectedItemIds.includes(item.id));
      
      setSearchResults(finalResults);
    } catch (error) {
      let errorMessage = "Fehler bei der Suche nach Items";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      NotyfService.showError(errorMessage);
    } finally {
      setIsSearching(false);
    }
  };

  // Add item to selection
  const addItem = (item: GalleryItem) => {
    setSelectedItems(prev => [...prev, item]);
    setSearchResults(prev => prev.filter(i => i.id !== item.id));
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
      // Convert Item to GalleryItem format
      const galleryItem: GalleryItem = {
        ...item,
        username: "You" // Since it's user's own item
      };
      addItem(galleryItem);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      NotyfService.showError("Listentitel ist erforderlich.");
      return;
    }

    try {
      await itemService.createItemList({
        title: title,
        description: description,
        item_ids: selectedItems.map(item => item.id),
        is_private: isPrivate,
      });
      NotyfService.showSuccess("Liste erfolgreich erstellt.");
      onNavigate("/item-list");
      setTitle("");
      setDescription("");
      setSelectedItems([]);
      setIsPrivate(false);
    } catch (err: any) {
      NotyfService.showError(err.message || "Fehler beim Erstellen der Liste.");
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

      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-green-600 via-blue-600 to-indigo-600 rounded-2xl overflow-hidden shadow-2xl">
        {/* Background Pattern */}
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
                Erstellen Sie Ihre persönliche Sammlung
              </Text>
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

          {/* Item Search Card */}
          <Card>
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <MagnifyingGlassIcon className="w-6 h-6 text-blue-600" />
                <Title className="text-xl">Items finden und hinzufügen</Title>
              </div>
              
              <div className="flex items-center space-x-2">
                <TextInput
                  placeholder="Nach Items suchen (Titel, Kategorie, Benutzer...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-grow"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
                <Button
                  icon={MagnifyingGlassIcon}
                  onClick={handleSearch}
                  loading={isSearching}
                  color="blue"
                >
                  Suchen
                </Button>
              </div>
              
              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-3">
                  <Text className="font-medium text-gray-700">Suchergebnisse</Text>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {searchResults.map(item => (
                      <Card
                        key={item.id}
                        className="!p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => addItem(item)}
                      >
                        <Flex alignItems="center" justifyContent="between">
                          <div className="flex items-center space-x-3 min-w-0">
                            <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div className="min-w-0 text-left">
                              <Text className="font-medium truncate">{item.title}</Text>
                              <div className="text-xs text-gray-500 truncate">
                                {item.category && `${item.category} • `}von {item.username}
                              </div>
                            </div>
                          </div>
                          <Button
                            icon={PlusIcon}
                            variant="light"
                            color="blue"
                            size="xs"
                          >
                            Hinzufügen
                          </Button>
                        </Flex>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Own Items Selection Card */}
          <Card>
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <RectangleStackIcon className="w-6 h-6 text-green-600" />
                <Title className="text-xl">Eigene Items auswählen</Title>
              </div>

              {userItems.length === 0 ? (
                <Text className="text-gray-500 italic">Keine eigenen Items vorhanden.</Text>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {userItems.map((item) => {
                    const isSelected = selectedItems.some(selected => selected.id === item.id);
                    return (
                      <div key={item.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                        <input
                          type="checkbox"
                          id={`item-${item.id}`}
                          checked={isSelected}
                          onChange={() => toggleItemSelection(item.id)}
                          className="rounded text-blue-500 focus:ring-blue-500"
                        />
                        <label htmlFor={`item-${item.id}`} className="flex-1 cursor-pointer">
                          <Text className="font-medium">{item.title}</Text>
                          <Text className="text-xs text-gray-500">
                            {item.category && `${item.category} • `}
                            {new Date(item.entered_on).toLocaleDateString()}
                          </Text>
                        </label>
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

      {/* Create Confirmation Dialog */}
      <Dialog open={isCreateConfirmOpen} onClose={() => setIsCreateConfirmOpen(false)}>
        <DialogPanel className="max-w-md bg-white rounded-xl shadow-xl p-6">
          <div className="text-center space-y-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            
            <Title className="text-lg font-semibold text-gray-900">
              Liste erstellen?
            </Title>
            
            <Text className="text-gray-500">
              Bist du sicher, dass du diese neue Liste erstellen möchtest?
            </Text>
            
            <Flex justifyContent="end" className="space-x-3 pt-4">
              <Button variant="secondary" onClick={() => setIsCreateConfirmOpen(false)}>
                Abbrechen
              </Button>
              <Button
                color="blue"
                onClick={() => {
                  setIsCreateConfirmOpen(false);
                  handleSubmit();
                }}
                className="bg-gradient-to-r from-green-600 to-blue-600 border-0"
              >
                Ja, erstellen
              </Button>
            </Flex>
          </div>
        </DialogPanel>
      </Dialog>
    </div>
  );
}