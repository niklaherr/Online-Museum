import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Title, TextInput, Textarea, Button } from "@tremor/react";
import Item from "interfaces/Item";
import { itemService } from "services/ItemService";
import NotyfService from "services/NotyfService";
import { userService } from "services/UserService";
import Loading from "components/helper/Loading";

type EditItemListProps = {
  onNavigate: (route: string) => void;
};

export default function EditItemList({ onNavigate }: EditItemListProps) {
  const { id } = useParams<{ id: string }>();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [userItems, setUserItems] = useState<Item[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadItemList = async () => {
      try {
        const [listDetails, listItems, allUserItems] = await Promise.all([
          itemService.fetchItemListById(id!),
          itemService.fetchItemsByItemListId(parseInt(id!)),
          itemService.fetchOwnItems()
        ]);

        setTitle(listDetails.title);
        setDescription(listDetails.description || "");
        setSelectedItemIds(listItems.map((item: Item) => item.id));
        setUserItems(allUserItems);
        setIsLoading(false);
      } catch (error) {
        let errorMessage = "Fehler beim Laden der Item-Liste";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        NotyfService.showError(errorMessage);
      }
    };

    loadItemList();
  }, [id]);

  const toggleItemSelection = (itemId: number) => {
    setSelectedItemIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleUpdate = async () => {
    if (!title.trim()) {
      NotyfService.showError("Listentitel ist erforderlich.");
      return;
    }

    try {
      await itemService.editItemList(parseInt(id!),{
        title,
        description,
        item_ids: selectedItemIds
      });
      NotyfService.showSuccess("Liste erfolgreich aktualisiert.");
      onNavigate("/item-list");
    } catch (error: any) {
      NotyfService.showError(error.message || "Fehler beim Aktualisieren der Liste.");
    }
  };

  if (isLoading) return <Loading />

  return (
    <Card className="max-w-2xl mx-auto mt-6 space-y-4">
      <Title>Item-Liste bearbeiten</Title>

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
        {userItems.length === 0 && (
          <p className="text-sm text-gray-500">Keine Items vorhanden.</p>
        )}
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

      <Button color="blue" onClick={handleUpdate}>
        Änderungen speichern
      </Button>
    </Card>
  );
}
