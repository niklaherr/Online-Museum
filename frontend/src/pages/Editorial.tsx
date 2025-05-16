import React, { useState, useEffect } from "react";
import { Card, Title, TextInput, Textarea, Button, Grid, Text, Badge, Flex, Dialog, DialogPanel } from "@tremor/react";
import { XMarkIcon, PlusIcon, MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/outline";
import { GalleryItem } from "interfaces/Item";
import { editorialService } from "services/EditorialService";
import NotyfService from "services/NotyfService";
import NoResults from "pages/NoResults";
import Editorial from "interfaces/Editorial";

type EditorialManagementProps = {
  onNavigate: (route: string) => void;
};

const EditorialManagement = ({ onNavigate }: EditorialManagementProps) => {
  // State for editorial list form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedItems, setSelectedItems] = useState<GalleryItem[]>([]);
  
  // State for search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GalleryItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // State for existing editorial lists
  const [editorialLists, setEditorialLists] = useState<Editorial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Load existing editorial lists
  useEffect(() => {
    const loadData = async () => {
      try {
        
        // Load existing editorial lists
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
  
  // Search for items
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await editorialService.searchItems(searchQuery);
      
      // Filter out items that are already selected
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
  
  // Add item to selection
  const addItem = (item: GalleryItem) => {
    setSelectedItems(prev => [...prev, item]);
    setSearchResults(prev => prev.filter(i => i.id !== item.id));
  };
  
  // Remove item from selection
  const removeItem = (itemId: number) => {
    setSelectedItems(prev => prev.filter(item => item.id !== itemId));
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
      
      // Clear form and refresh lists
      setTitle("");
      setDescription("");
      setSelectedItems([]);
      setSearchResults([]);
      setSearchQuery("");
      
      // Reload editorial lists
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
  
  // Delete an editorial list
  const confirmDeleteList = (listId: number) => {
    setSelectedListId(listId);
    setIsDeleteModalOpen(true);
  };
  
  const handleDeleteList = async () => {
    if (selectedListId === null) return;
    
    try {
      await editorialService.deleteEditorialList(selectedListId);
      NotyfService.showSuccess("Redaktionelle Liste erfolgreich gelöscht");
      
      // Remove the deleted list from state
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
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="text-amber-500">
          <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2 mt-8">Redaktionelle Listen verwalten</h1>
        <Text>Erstellen und verwalten Sie kuratierte Listen mit Items von verschiedenen Benutzern.</Text>
      </div>
      
      {/* Create new editorial list */}
      <Card>
        <Title className="mb-4">Neue redaktionelle Liste erstellen</Title>
        
        <div className="space-y-4 mb-6">
          <TextInput
            placeholder="Titel der Liste"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          
          <Textarea
            placeholder="Beschreibung (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
        
        {/* Search for items */}
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
              color="amber"
            >
              Suchen
            </Button>
          </div>
          
          {/* Search results */}
          {searchResults.length > 0 && (
            <div className="mb-6">
              <Text className="font-medium mb-2">Suchergebnisse</Text>
              <Grid numItemsLg={3} numItemsMd={2} numItemsSm={1} className="gap-3">
                {searchResults.map(item => (
                  <Card key={item.id} className="!p-3 cursor-pointer hover:bg-gray-50" onClick={() => addItem(item)}>
                    <Flex alignItems="center" justifyContent="between">
                      <Flex alignItems="center" className="space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                          {item.image && (
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <Text className="font-medium truncate">{item.title}</Text>
                          <div className="flex items-center text-xs text-gray-500">
                            <Badge color="gray" size="xs">{item.category}</Badge>
                            <span className="ml-2 truncate">von {item.username}</span>
                          </div>
                        </div>
                      </Flex>
                      <Button icon={PlusIcon} variant="light" color="amber" tooltip="Hinzufügen" />
                    </Flex>
                  </Card>
                ))}
              </Grid>
            </div>
          )}
          
          {/* Selected items */}
          <div>
            <Text className="font-medium mb-2">Ausgewählte Items ({selectedItems.length})</Text>
            
            {selectedItems.length === 0 ? (
              <Text className="text-gray-500 italic">Keine Items ausgewählt. Nutzen Sie die Suche, um Items hinzuzufügen.</Text>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto p-1">
                {selectedItems.map(item => (
                  <Card key={item.id} className="!p-3">
                    <Flex alignItems="center" justifyContent="between">
                      <Flex alignItems="center" className="space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                          {item.image && (
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <Text className="font-medium truncate">{item.title}</Text>
                          <div className="flex items-center text-xs text-gray-500">
                            <Badge color="gray" size="xs">{item.category}</Badge>
                            <span className="ml-2 truncate">von {item.username}</span>
                          </div>
                        </div>
                      </Flex>
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
        
        <div className="border-t pt-4">
          <Button
            color="amber"
            onClick={handleCreateList}
            disabled={!title.trim() || selectedItems.length === 0}
          >
            Redaktionelle Liste erstellen
          </Button>
        </div>
      </Card>
      
      {/* Existing editorial lists */}
      <Card>
        <Title className="mb-4">Existierende redaktionelle Listen</Title>
        
        {editorialLists.length === 0 ? (
          <Text className="text-gray-500 italic">Keine redaktionellen Listen vorhanden.</Text>
        ) : (
          <div className="space-y-3">
            {editorialLists.map(list => (
              <Card key={list.id} className="!p-4">
                <Flex alignItems="center" justifyContent="between">
                  <div>
                    <Text className="font-medium">{list.title}</Text>
                    {list.description && (
                      <Text className="text-sm text-gray-500 line-clamp-1">{list.description}</Text>
                    )}
                    <Text className="text-xs text-gray-400 mt-1">
                      Erstellt am: {new Date(list.entered_on).toLocaleDateString()}
                    </Text>
                  </div>
                  <Flex className="space-x-2">
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
                      color="amber"
                      onClick={() => onNavigate(`/editorial/${list.id}/edit`)}
                    >
                      Bearbeiten
                    </Button>
                    <Button
                      size="xs"
                      variant="light"
                      color="red"
                      icon={TrashIcon}
                      onClick={() => confirmDeleteList(list.id)}
                    />
                  </Flex>
                </Flex>
              </Card>
            ))}
          </div>
        )}
      </Card>
      
      {/* Delete confirmation modal */}
      <Dialog open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <DialogPanel className="max-w-sm bg-white rounded-xl shadow-md p-6">
          <Title>Liste löschen bestätigen</Title>
          <Text className="my-4">
            Möchten Sie diese redaktionelle Liste wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
          </Text>
          <Flex justifyContent="end" className="space-x-2">
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
              Abbrechen
            </Button>
            <Button color="red" onClick={handleDeleteList}>
              Löschen
            </Button>
          </Flex>
        </DialogPanel>
      </Dialog>
    </div>
  );
};

export default EditorialManagement;

