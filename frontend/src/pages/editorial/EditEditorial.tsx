import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Title, TextInput, Textarea, Button, Flex, Grid, Text, Dialog, DialogPanel } from "@tremor/react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";
import { MagnifyingGlassIcon, PlusIcon, XMarkIcon, SparklesIcon } from "@heroicons/react/24/outline";
import Loading from "components/helper/Loading";
import { GalleryItem } from "interfaces/Item";
import NotyfService from "services/NotyfService";
import { editorialService } from "services/EditorialService";
import { itemAssistantService } from "services/ItemAssistantService";
import AlertDialog from "components/helper/AlertDialog";

// Props for navigation callback
type EditEditorialProps = {
  onNavigate: (route: string) => void;
};

function EditEditorial({ onNavigate }: EditEditorialProps) {
  const { id } = useParams<{ id: string }>();

  // State for editorial list form fields and selected items
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedItems, setSelectedItems] = useState<GalleryItem[]>([]);

  // State for item search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GalleryItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Loading state for initial data
  const [isLoading, setIsLoading] = useState(true);

  // State for AI description generation dialog
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateConfirmOpen, setIsUpdateConfirmOpen] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState("");

  // Load editorial list details and items on mount
  useEffect(() => {
    const loadEditorial = async () => {
      try {
        const [listDetails, listItems] = await Promise.all([
          editorialService.fetchEditorialListById(id!),
          editorialService.fetchItemsByEditorialId(parseInt(id!)),
        ]);
        setTitle(listDetails.title);
        setDescription(listDetails.description || "");
        setSelectedItems(listItems);
        setIsLoading(false);
      } catch (error) {
        let errorMessage = "Fehler beim Laden der Item-Liste";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        NotyfService.showError(errorMessage);
      }
    };
    loadEditorial();
  }, [id]);

  // Search for items by query, filter out already selected
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const results = await editorialService.searchItems(searchQuery);
      const selectedItemIds = selectedItems.map(item => item.id);
      const filteredResults = results.filter(item => !selectedItemIds.includes(item.id));
      setSearchResults(filteredResults);
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

  // Add item to selected items
  const addItem = (item: GalleryItem) => {
    setSelectedItems(prev => [...prev, item]);
    setSearchResults(prev => prev.filter(i => i.id !== item.id));
  };

  // Remove item from selected items
  const removeItem = (itemId: number) => {
    setSelectedItems(prev => prev.filter(item => item.id !== itemId));
  };

  // Generate AI-based description for the editorial list
  const handleGenerateDescription = async () => {
    if (!title.trim()) {
      NotyfService.showError("Bitte geben Sie zuerst einen Titel ein.");
      return;
    }
    if (selectedItems.length === 0) {
      NotyfService.showError("Bitte wählen Sie zuerst mindestens ein Item aus.");
      return;
    }
    setIsGenerating(true);
    try {
      
      const generatedText = await itemAssistantService.generateEditorialListDescription(title, selectedItems);
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

  // Accept and set the generated description
  const handleAcceptDescription = () => {
    setDescription(generatedDescription);
    setIsDialogOpen(false);
  };

  // Update the editorial list with current form data
  const handleUpdateList = async () => {
    if (!title.trim()) {
      NotyfService.showError("Bitte geben Sie einen Titel ein");
      return;
    }
    if (selectedItems.length === 0) {
      NotyfService.showError("Bitte fügen Sie mindestens ein Item zur Liste hinzu");
      return;
    }
    try {
      await editorialService.updateEditorialList(parseInt(id!), {
        title: title.trim(),
        description: description.trim(),
        item_ids: selectedItems.map(item => item.id)
      });
      NotyfService.showSuccess("Redaktionelle Liste erfolgreich bearbeitet");
      onNavigate('/editorial')
    } catch (error) {
      let errorMessage = "Fehler beim Bearbeiten der redaktionellen Liste";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      NotyfService.showError(errorMessage);
    }
  };

  // Show loading spinner while fetching data
  if (isLoading) return <Loading />

  return (
    <div className="space-y-8">
      {/* Page title */}
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Redaktionelle Listen bearbeiten</h1>

      <Card>
        <Title className="mb-4">Redaktionelle Liste bearbeiten</Title>

        {/* Editorial list form fields */}
        <div className="space-y-4 mb-6">
          <TextInput
            placeholder="Titel der Liste"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {/* Description field with AI generation button and tooltip */}
          <TooltipProvider>
            <div>
              <div className="flex justify-between items-center mb-2">
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
                        >
                          KI-Beschreibung generieren
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
                  >
                    KI-Beschreibung generieren
                  </Button>
                )}
              </div>
              <Textarea
                placeholder="Beschreibung (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </TooltipProvider>
        </div>

        {/* Item search and add section */}
        <div className="border-t pt-4 mb-6">
          <Title className="text-lg mb-4">Items finden und hinzufügen</Title>

          {/* Search input and button */}
          <div className="flex items-center space-x-2 mb-4">
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

          {/* Render search results as cards */}
          {searchResults.length > 0 && (
            <div className="mb-6">
              <Text className="font-medium mb-2">Suchergebnisse</Text>
              <Grid numItemsLg={3} numItemsMd={2} numItemsSm={1} className="gap-3">
                {searchResults.map(item => (
                  <Card
                    key={item.id}
                    className="!p-3 cursor-pointer hover:bg-gray-50"
                    onClick={() => addItem(item)}
                  >
                    <Flex alignItems="center" justifyContent="between">
                      {/* Item image and info */}
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
                            Kategorie: {item.category} &nbsp;&bull;&nbsp; von {item.username}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5 truncate">
                            Erstellt am: {new Date(item.entered_on).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-400 truncate">
                            ID: {item.id}
                          </div>
                        </div>
                      </div>
                      {/* Add item button */}
                      <Button
                        icon={PlusIcon}
                        variant="light"
                        color="blue"
                        tooltip="Hinzufügen"
                      />
                    </Flex>
                  </Card>
                ))}
              </Grid>
            </div>
          )}

          {/* List of selected items */}
          <div>
            <Text className="font-medium mb-2">Ausgewählte Items ({selectedItems.length})</Text>
            {selectedItems.length === 0 ? (
              <Text className="text-gray-500 italic">Keine Items ausgewählt. Nutzen Sie die Suche, um Items hinzuzufügen.</Text>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto p-1">
                {selectedItems.map(item => (
                  <Card key={item.id} className="!p-3">
                    <Flex alignItems="center" justifyContent="between">
                      {/* Item image and info */}
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-10 h-10 bg-gray-200 rounded overflow-hidden flex-shrink-0">
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
                            Kategorie: {item.category} &nbsp;&bull;&nbsp; von {item.username}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5 truncate">
                            Erstellt am: {new Date(item.entered_on).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-400 truncate">
                            ID: {item.id}
                          </div>
                        </div>
                      </div>
                      {/* Remove item button */}
                      <Button
                        icon={XMarkIcon}
                        variant="light"
                        color="red"
                        tooltip="Entfernen"
                        onClick={() => removeItem(item.id)}
                      />
                    </Flex>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit button for updating the editorial list */}
        <div className="border-t pt-4">
          <Button
            color="blue"
            onClick={() => setIsUpdateConfirmOpen(true)}
            disabled={!title.trim() || selectedItems.length === 0}
          >
            Redaktionelle Liste bearbeiten
          </Button>
        </div>
      </Card>

      {/* Dialog for displaying and accepting the generated AI description */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} static={true}>
        <DialogPanel>
          <Title className="mb-4">Generierte Beschreibung</Title>
          <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200">
            <Text>{generatedDescription}</Text>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              color="gray"
              onClick={() => {
                setIsDialogOpen(false);
                handleGenerateDescription();
              }}
            >
              Neu generieren
            </Button>
            <Button color="blue" onClick={handleAcceptDescription}>
              Übernehmen
            </Button>
          </div>
        </DialogPanel>
      </Dialog>

      {/* Dialog for editing item */}
      <AlertDialog
        open={isUpdateConfirmOpen}
        type={"update"}
        title="Änderungen speichern?"
        description="Bist du sicher, dass du die Änderungen an diesem Liste speichern möchtest?"
        onClose={() => setIsUpdateConfirmOpen(false)}
        onConfirm={() => {
          setIsUpdateConfirmOpen(false);
          handleUpdateList();
        }}
      />
    </div>
  );
};

export default EditEditorial;