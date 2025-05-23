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
} from "@tremor/react";
import { SparklesIcon } from "@heroicons/react/24/outline";
import Item from "interfaces/Item";
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
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleUpdate = async () => {
    if (!title.trim()) {
      NotyfService.showError("Listentitel ist erforderlich.");
      return;
    }

    try {
      await itemService.editItemList(parseInt(id!), {
        title,
        description,
        item_ids: selectedItemIds,
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

    if (selectedItemIds.length === 0) {
      NotyfService.showError("Bitte wähle zuerst mindestens ein Item aus.");
      return;
    }

    setIsGenerating(true);

    try {
      const selectedItems = userItems.filter((item) =>
        selectedItemIds.includes(item.id)
      );

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

  return (
    <Card className="max-w-2xl mx-auto mt-6 space-y-4">
      <Title>Item-Liste bearbeiten</Title>

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
            disabled={selectedItemIds.length === 0 || !title.trim()}
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

      <div className="flex items-center justify-between">
        <Text>Liste privat machen</Text>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-blue-600"
            checked={isPrivate}
            onChange={() => setIsPrivate(!isPrivate)}
          />
        </label>
      </div>

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
              className="rounded text-blue-500 focus:ring-blue-500"
            />
            <label htmlFor={`item-${item.id}`} className="text-sm">
              {item.title}
            </label>
          </div>
        ))}
      </div>

      <Button color="blue" onClick={() => setIsUpdateConfirmOpen(true)}>
        Änderungen speichern
      </Button>

      {/* Dialog: Beschreibungsvorschau */}
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

      {/* Dialog: Bestätigung vor Update */}
      <Dialog open={isUpdateConfirmOpen} onClose={() => setIsUpdateConfirmOpen(false)}>
        <DialogPanel className="max-w-sm bg-white rounded-xl shadow-md p-6">
          <Title>Änderungen speichern?</Title>
          <Text>
            Bist du sicher, dass du die Änderungen an dieser Liste speichern möchtest?
          </Text>
          <Flex justifyContent="end" className="mt-6 space-x-2">
            <Button variant="secondary" onClick={() => setIsUpdateConfirmOpen(false)}>
              Abbrechen
            </Button>
            <Button
              color="blue"
              variant="primary"
              onClick={() => {
                setIsUpdateConfirmOpen(false);
                handleUpdate();
              }}
            >
              Ja, speichern
            </Button>
          </Flex>
        </DialogPanel>
      </Dialog>
    </Card>
  );
}
