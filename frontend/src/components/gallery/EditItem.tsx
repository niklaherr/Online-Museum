import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  TextInput,
  Textarea,
  Button,
  Title,
  Text,
  Dialog,
  DialogPanel,
  Flex,
} from "@tremor/react";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { itemService } from "../../services/ItemService";
import { itemAssistantService } from "../../services/ItemAssistantService";
import NotyfService from "services/NotyfService";
import Loading from "components/helper/Loading";

type EditItemProps = {
  onNavigate: (route: string) => void;
};

export const EditItem = ({ onNavigate }: EditItemProps) => {
  const { id } = useParams<{ id: string }>();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPrivate, setIsPrivate] = useState(false);

  // Dialog states
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateConfirmOpen, setIsUpdateConfirmOpen] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState("");

  useEffect(() => {
    const loadItem = async () => {
      try {
        const item = await itemService.fetchItemById(parseInt(id!));
        setTitle(item.title);
        setCategory(item.category);
        setDescription(item.description);
        setExistingImage(item.image);
        setIsPrivate(item.isprivate);
        setIsLoading(false);
      } catch (error) {
        let errorMessage = "Fehler beim Laden der Item Informationen";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        NotyfService.showError(errorMessage);
      }
    };

    loadItem();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("isprivate", isPrivate.toString());
      if (imageFile) formData.append("image", imageFile);

      await itemService.updateItem(parseInt(id!), formData);
      NotyfService.showSuccess("Item erfolgreich aktualisiert.");
      onNavigate("/items");
    } catch (error) {
      let errorMessage = "Fehler beim Aktualisieren des Items";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      NotyfService.showError(errorMessage);
    }
  };

  const handleGenerateDescription = async () => {
    if (!title.trim()) {
      NotyfService.showError("Bitte gib zuerst einen Titel ein.");
      return;
    }

    if (!category.trim()) {
      NotyfService.showError("Bitte gib eine Kategorie ein.");
      return;
    }

    setIsGenerating(true);

    try {
      const generatedText = await itemAssistantService.generateDescription(title, category);
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
      <Title>Item bearbeiten</Title>
      <div className="space-y-4">
        <TextInput
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextInput
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
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
              disabled={!title || !category}
            >
              KI-Beschreibung generieren
            </Button>
          </div>
          <Textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Text>Bild hochladen</Text>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {(imageFile || existingImage) && (
          <div className="pt-4">
            <Text className="text-sm text-gray-600 mb-2">Vorschau:</Text>
            <img
              src={imageFile ? URL.createObjectURL(imageFile) : existingImage!}
              alt="Vorschau"
              className="max-h-40 rounded-md"
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <Text>Item privat machen</Text>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              checked={isPrivate}
              onChange={() => setIsPrivate(!isPrivate)}
            />
          </label>
        </div>
      </div>

      <Button color="blue" onClick={() => setIsUpdateConfirmOpen(true)} size="lg" className="w-full">
        Änderungen speichern
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
            <Button color="blue" onClick={handleAcceptDescription}>
              Übernehmen
            </Button>
          </div>
        </DialogPanel>
      </Dialog>

      {/* Dialog für Update-Bestätigung */}
      <Dialog open={isUpdateConfirmOpen} onClose={() => setIsUpdateConfirmOpen(false)}>
        <DialogPanel className="max-w-sm bg-white rounded-xl shadow-md p-6">
          <Title>Änderungen speichern?</Title>
          <Text>
            Bist du sicher, dass du die Änderungen an diesem Item speichern möchtest?
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
};
