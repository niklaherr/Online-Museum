import { useEffect, useState } from "react";
import { Card, Title, TextInput, Textarea, Button, Text, Dialog, DialogPanel, Flex } from "@tremor/react";
import { SparklesIcon } from "@heroicons/react/24/outline";
import Item from "interfaces/Item";
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
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
  
  // Neuer State für KI-Beschreibung
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  const toggleItemSelection = (id: number) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
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
        item_ids: selectedItemIds 
      });
      NotyfService.showSuccess("Liste erfolgreich erstellt.");
      onNavigate('/item-list')
      setTitle("");
      setDescription("");
      setSelectedItemIds([]);
    } catch (err: any) {
      NotyfService.showError(err.message || "Fehler beim Erstellen der Liste.");
    }
  };
  
  // KI-Beschreibung generieren basierend auf ausgewählten Items
  const handleGenerateDescription = async () => {
    if (selectedItemIds.length === 0) {
      NotyfService.showError("Bitte wähle zuerst mindestens ein Item aus.");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Sammle Informationen über die ausgewählten Items
      const selectedItems = userItems.filter(item => selectedItemIds.includes(item.id));
      const itemTitles = selectedItems.map(item => item.title);
      const itemCategories = selectedItems.map(item => item.category).filter(Boolean);
      
      // Erstelle eine Beschreibung der Sammlung
      const prompt = `
        Erstelle eine kurze und ansprechende Beschreibung für eine Sammlung mit dem Titel "${title || 'Meine Sammlung'}", 
        die folgende Elemente enthält: ${itemTitles.join(', ')}. 
        ${itemCategories.length > 0 ? `Die Sammlung enthält Elemente aus folgenden Kategorien: ${[...new Set(itemCategories)].join(', ')}.` : ''}
        Die Beschreibung sollte maximal 3 Sätze umfassen und die Einzigartigkeit dieser Sammlung hervorheben.
      `;
      
      const generatedText = await itemAssistantService.generateDescription(title || "Sammlung", itemTitles.join(", "));
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
  
  // Beschreibung übernehmen
  const handleAcceptDescription = () => {
    setDescription(generatedDescription);
    setIsDialogOpen(false);
  };

  return (
    <Card className="max-w-2xl mx-auto mt-6 space-y-4">
      <Title>Neue Item-Liste erstellen</Title>

      <TextInput
        placeholder="Listentitel"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div>
        <div className="flex justify-between items-center mb-2">
          <Text>Beschreibung</Text>
          <Button
            icon={SparklesIcon}
            size="xs"
            color="blue"
            onClick={handleGenerateDescription}
            loading={isGenerating}
            disabled={selectedItemIds.length === 0}
          >
            KI-Beschreibung generieren
          </Button>
        </div>
        <Textarea
          placeholder="Beschreibung (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Title className="text-base">Items auswählen</Title>
        {userItems.length === 0 && <p className="text-sm text-gray-500">Keine Items vorhanden.</p>}
        {userItems.map((item) => (
          <div key={item.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`item-${item.id}`}
              checked={selectedItemIds.includes(item.id)}
              onChange={() => toggleItemSelection(item.id)}
              className="rounded text-blue-500 focus:ring-blue-500"
            />
            <label htmlFor={`item-${item.id}`} className="text-sm">
              {item.title}
            </label>
          </div>
        ))}
      </div>

      <Button 
        color="blue" 
        onClick={handleSubmit}
        size="lg"
        className="w-full"
      >
        Liste erstellen
      </Button>
      
      {/* Dialog für Beschreibungsvorschau */}
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
            <Button
              color="blue"
              onClick={handleAcceptDescription}
            >
              Übernehmen
            </Button>
          </div>
        </DialogPanel>
      </Dialog>
    </Card>
  );
}