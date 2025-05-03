import { useEffect, useState } from "react";
import { Card, Title, TextInput, Textarea, Button } from "@tremor/react";
import Item from "interfaces/Item";
import { itemService } from "services/ItemService";
import NotyfService from "services/NotyfService";

export default function CreateItemList() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [userItems, setUserItems] = useState<Item[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchUserItems = async () => {
      try {
        const allItems = await itemService.fetchOwnItems(); // Add this in your service
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
      /*
        const newList = await itemService.createItemList({ title, description });

        for (const itemId of selectedItemIds) {
          await itemService.addItemToItemList(newList.id, itemId);
        }
      */
      NotyfService.showSuccess("Liste erfolgreich erstellt.");
      setTitle("");
      setDescription("");
      setSelectedItemIds([]);
    } catch (err: any) {
      NotyfService.showError(err.message || "Fehler beim Erstellen der Liste.");
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mt-6 space-y-4">
      <Title>Neue Item-Liste erstellen</Title>

      <TextInput
        placeholder="Listentitel"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Textarea
        placeholder="Beschreibung (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

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
            />
            <label htmlFor={`item-${item.id}`}>{item.title}</label>
          </div>
        ))}
      </div>

      <Button color="blue" onClick={handleSubmit}>
        Liste erstellen
      </Button>
    </Card>
  );
}
