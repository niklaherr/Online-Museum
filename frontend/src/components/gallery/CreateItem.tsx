import React, { useState } from "react";
import { Button, Card, TextInput, Textarea, Title, Text, Dialog, DialogPanel } from "@tremor/react";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { itemService } from "../../services/ItemService";
import { itemAssistantService } from "../../services/ItemAssistantService";
import NotyfService from "services/NotyfService";

type CreateItemProps = {
  onNavigate: (route: string) => void;
};

export const CreateItem = ({ onNavigate }: CreateItemProps) => {
  // State-Variablen
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState("");
  
  // Bilddatei verarbeiten
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Vorschau erstellen
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Item erstellen
  const handleCreate = async () => {
    if (!title.trim()) {
      NotyfService.showError("Bitte gib einen Titel ein.");
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("description", description);
      if (imageFile) formData.append("image", imageFile);
      
      await itemService.createItem(formData);
      NotyfService.showSuccess("Item erfolgreich erstellt.");
      onNavigate("/items");
    } catch (error) {
      let errorMessage = "Fehler beim Erstellen eines Items";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      NotyfService.showError(errorMessage);
    }
  };
  
  // KI-Beschreibung generieren
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
    <Card className="max-w-2xl mx-auto mt-6 space-y-6">
      <Title>Neues Item erstellen</Title>
      
      {/* Basisdaten */}
      <div className="space-y-4">
        <TextInput
          placeholder="Titel"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        
        <TextInput
          placeholder="Kategorie"
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
            placeholder="Beschreibung"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>
      </div>
      
      {/* Bildupload */}
      <div className="space-y-2">
        <Text>Bild hochladen</Text>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        
        {imagePreview && (
          <div className="mt-2">
            <img 
              src={imagePreview} 
              alt="Vorschau" 
              className="max-h-40 rounded-md"
            />
          </div>
        )}
      </div>
      
      {/* Erstellen-Button */}
      <Button 
        color="blue" 
        onClick={handleCreate}
        size="lg"
        className="w-full"
      >
        Item erstellen
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
};