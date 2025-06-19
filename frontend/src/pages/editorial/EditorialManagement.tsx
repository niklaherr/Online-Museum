import { useState, useEffect } from "react";
import { Card, Title, TextInput, Textarea, Button, Grid, Text, Flex, Dialog, DialogPanel } from "@tremor/react";
import { XMarkIcon, PlusIcon, MagnifyingGlassIcon, TrashIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";
import { GalleryItem } from "interfaces/Item";
import { editorialService } from "services/EditorialService";
import { itemAssistantService } from "services/ItemAssistantService";
import NotyfService from "services/NotyfService";
import Editorial from "interfaces/Editorial";
import Loading from "components/helper/Loading";
import AlertDialog from "components/helper/AlertDialog";

type EditorialManagementProps = {
  onNavigate: (route: string) => void;
};

const EditorialManagement = ({ onNavigate }: EditorialManagementProps) => {
  // State for editorial list creation form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedItems, setSelectedItems] = useState<GalleryItem[]>([]);

  // State for item search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GalleryItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // State for existing editorial lists and loading
  const [editorialLists, setEditorialLists] = useState<Editorial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModelOpen, setIsCreateModelOpen] = useState(false);

  // State for AI description generation dialog
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState("");

  // Load editorial lists on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const lists = await editorialService.fetchEditorialLists();
        setEditorialLists(lists);
        setIsLoading(false);
      } catch (error) {
        let errorMessage = "Fehler beim Laden der redaktionellen Listen";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        NotyfService.showError(errorMessage);
      }
    };
    loadData();
  }, [onNavigate]);

  // Search for items by query
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const results = await editorialService.searchItems(searchQuery);
      // Exclude already selected items from results
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

  // Add item to selected list
  const addItem = (item: GalleryItem) => {
    setSelectedItems(prev => [...prev, item]);
    setSearchResults(prev => prev.filter(i => i.id !== item.id));
  };

  // Remove item from selected list
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

  // Accept and use the generated description
  const handleAcceptDescription = () => {
    setDescription(generatedDescription);
    setIsDialogOpen(false);
  };

  // Create a new editorial list
  const handleCreateList = async () => {
    if (!title.trim()) {
      NotyfService.showError("Bitte geben Sie einen Titel ein");
      return;
    }
    if (selectedItems.length === 0) {
      NotyfService.showError("Bitte fügen Sie mindestens ein Item zur Liste hinzu");
      return;
    }
    try {
      await editorialService.createEditorialList({
        title: title.trim(),
        description: description.trim(),
        item_ids: selectedItems.map(item => item.id)
      });
      NotyfService.showSuccess("Redaktionelle Liste erfolgreich erstellt");
      // Reset form and reload lists
      setTitle("");
      setDescription("");
      setSelectedItems([]);
      setSearchResults([]);
      setSearchQuery("");
      const lists = await editorialService.fetchEditorialLists();
      setEditorialLists(lists);
    } catch (error) {
      let errorMessage = "Fehler beim Erstellen der redaktionellen Liste";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      NotyfService.showError(errorMessage);
    }
  };

  // Open delete confirmation modal for a list
  const confirmDeleteList = (listId: number) => {
    setSelectedListId(listId);
    setIsDeleteModalOpen(true);
  };

  // Delete an editorial list
  const handleDeleteList = async () => {
    if (selectedListId === null) return;
    try {
      await editorialService.deleteEditorialList(selectedListId);
      NotyfService.showSuccess("Redaktionelle Liste erfolgreich gelöscht");
      setEditorialLists(prev => prev.filter(list => list.id !== selectedListId));
      setIsDeleteModalOpen(false);
      setSelectedListId(null);
    } catch (error) {
      let errorMessage = "Fehler beim Löschen der redaktionellen Liste";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      NotyfService.showError(errorMessage);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2 ">Redaktionelle Listen verwalten</h1>
        <Text>Erstellen und verwalten Sie kuratierte Listen mit Items von verschiedenen Benutzern.</Text>
      </div>

      {/* Editorial list creation form */}
      <Card>
        <Title className="mb-4">Neue redaktionelle Liste erstellen</Title>
        <div className="space-y-4 mb-6">
          <TextInput
            placeholder="Titel der Liste"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          {/* Description input and AI generation button */}
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
          {/* Display search results */}
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
                      {/* Item info */}
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
          {/* Display selected items */}
          <div>
            <Text className="font-medium mb-2">Ausgewählte Items ({selectedItems.length})</Text>
            {selectedItems.length === 0 ? (
              <Text className="text-gray-500 italic">Keine Items ausgewählt. Nutzen Sie die Suche, um Items hinzuzufügen.</Text>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto p-1">
                {selectedItems.map(item => (
                  <Card key={item.id} className="!p-3">
                    <Flex alignItems="center" justifyContent="between">
                      {/* Selected item info */}
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
        {/* Create editorial list button */}
        <div className="border-t pt-4">
          <Button
            color="blue"
            onClick={() => setIsCreateModelOpen(true)}
            disabled={!title.trim() || selectedItems.length === 0}
          >
            Redaktionelle Liste erstellen
          </Button>
        </div>
      </Card>

      {/* List of existing editorial lists */}
      <Card>
        <Title className="mb-4">Existierende redaktionelle Listen</Title>
        {editorialLists.length === 0 ? (
          <Text className="text-gray-500 italic">Keine redaktionellen Listen vorhanden.</Text>
        ) : (
          <div className="space-y-3">
            {editorialLists.map(list => (
              <Card key={list.id} className="p-4">
                <div className="flex justify-between items-stretch">
                  {/* Editorial list info and actions */}
                  <div className="flex-1">
                    <Text className="font-medium">{list.title}</Text>
                    {list.description && (
                      <Text className="text-sm text-gray-500 line-clamp-1">
                        {list.description}
                      </Text>
                    )}
                    <Text className="text-xs text-gray-400 mt-1">
                      Erstellt am: {new Date(list.entered_on).toLocaleDateString()}
                    </Text>
                    <div className="mt-3 flex space-x-2">
                      <Button
                        size="xs"
                        variant="light"
                        color="blue"
                        onClick={() => onNavigate(`/editorial/${list.id}`)}
                      >
                        Anzeigen
                      </Button>
                      <Button
                        size="xs"
                        variant="light"
                        color="blue"
                        onClick={() => onNavigate(`/editorial/${list.id}/edit`)}
                      >
                        Bearbeiten
                      </Button>
                    </div>
                  </div>
                  {/* Delete editorial list button */}
                  <div className="flex items-center ml-4">
                    <Button
                      size="sm"
                      variant="light"
                      color="red"
                      icon={TrashIcon}
                      onClick={() => confirmDeleteList(list.id)}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {/* Dialog for AI-generated description */}
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

      {/* Create confirmation dialog */}
      <AlertDialog
        open={isCreateModelOpen}
        type={"create"}
        title="Redaktionelle Liste erstellen?"
        description="Bist du sicher, dass du diese redaktionelle Liste erstellen möchtest? Du kannst die Liste später bearbeiten."
        onClose={() => setIsCreateModelOpen(false)}
        onConfirm={() => {
          setIsCreateModelOpen(false);
          handleCreateList();
        }}
      />

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={isDeleteModalOpen}
        type={"delete"}
        title="Redaktionelle Liste löschen?"
        description="Bist du sicher, dass du diese Inhalte löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden."
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          setIsDeleteModalOpen(false);
          handleDeleteList();
        }}
      />
    </div>
  );
};

export default EditorialManagement;