import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Title, TextInput, Textarea, Button, Badge, Dialog, DialogPanel, Flex, Grid, Text } from "@tremor/react";
import Item, { GalleryItem } from "interfaces/Item";
import { itemService } from "services/ItemService";
import NotyfService from "services/NotyfService";
import { userService } from "services/UserService";
import { editorialService } from "services/EditorialService";
import { MagnifyingGlassIcon, PlusIcon, XMarkIcon, TrashIcon } from "@heroicons/react/24/outline";
import Editorial from "interfaces/Editorial";
import Loading from "components/helper/Loading";

type EditEditorialProps = {
  onNavigate: (route: string) => void;
};

function EditEditorial({ onNavigate }: EditEditorialProps) {
  const { id } = useParams<{ id: string }>();

   // State for editorial list form
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedItems, setSelectedItems] = useState<GalleryItem[]>([]);
    
    // State for search functionality
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<GalleryItem[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    
    const [isLoading, setIsLoading] = useState(true);


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
  
  if (isLoading) return <Loading />
  
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2 mt-8">Redaktionelle Listen bearbeiten</h1>
      
      {/* Create new editorial list */}
      <Card>
        <Title className="mb-4">Redaktionelle Liste bearbeiten</Title>
        
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
              color="blue"
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
                  <Card
                    key={item.id}
                    className="!p-3 cursor-pointer hover:bg-gray-50"
                    onClick={() => addItem(item)}
                  >
                    <Flex alignItems="center" justifyContent="between">
                      {/* Left: Image and Text */}
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
              
                        {/* Text content aligned left */}
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
              
                      {/* Right: Add Button */}
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
                      {/* Left: Image and text */}
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
              
                      {/* Right: Remove button */}
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
            color="blue"
            onClick={handleUpdateList}
            disabled={!title.trim() || selectedItems.length === 0}
          >
            Redaktionelle Liste bearbeiten
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EditEditorial;
