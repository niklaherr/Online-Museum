import React, { useState } from "react";
import { Button, Card, TextInput, Textarea, Title, Select, SelectItem, Text, Dialog, DialogPanel } from "@tremor/react";
import { itemService } from "../../services/ItemService";
import NotyfService from "services/NotyfService";

// Konfiguration für die API
const MISTRAL_API_KEY = "SpbqZllg57jFyYGIT0PnvGzn8QPAX5Hs";
const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";

// Verfügbare Modelle
const models = [
  { value: "mistral-tiny", name: "Mistral Tiny (schnell)" },
  { value: "mistral-small", name: "Mistral Small (ausgewogen)" },
  { value: "mistral-medium", name: "Mistral Medium (kreativ)" },
];

// Verfügbare Schreibstile
const styles = [
  { value: "neutral", name: "Neutral" },
  { value: "professional", name: "Professionell" },
  { value: "casual", name: "Locker" },
  { value: "enthusiastic", name: "Enthusiastisch" },
  { value: "creative", name: "Kreativ" },
];

// Beschreibungs-Prompt erstellen
const generatePrompt = (title: string, category: string, style: string, imageData?: string) => {
  // Kontextinformationen ohne direkte Erwähnung
  const contextInfo = `Es handelt sich um ein Produkt aus der Kategorie ${category}.`;
  
  switch (style) {
    case "professional":
      return `Erstelle eine präzise, professionelle Produktbeschreibung. ${contextInfo} Der Name des Produkts ist "${title}". Verwende sachliche Sprache und betone die wichtigsten Eigenschaften. Maximal 3 Sätze.`;
    case "casual":
      return `Erstelle eine lockere, leicht verständliche Produktbeschreibung. ${contextInfo} Das Produkt heißt "${title}". Verwende alltägliche Sprache und sei conversational. Maximal 3 Sätze.`;
    case "enthusiastic":
      return `Erstelle eine begeisterte, energiegeladene Produktbeschreibung. ${contextInfo} Das Produkt trägt den Namen "${title}". Verwende überzeugende Sprache und hebe die Vorteile hervor. Maximal 3 Sätze.`;
    case "creative":
      return `Erstelle eine kreative, ungewöhnliche Produktbeschreibung. ${contextInfo} Der Produktname ist "${title}". Sei originell und verwende bildhafte Sprache. Maximal 3 Sätze.`;
    default: // neutral
      return `Erstelle eine klare, informative Produktbeschreibung. ${contextInfo} Der Name lautet "${title}". Halte die Beschreibung sachlich und informativ. Maximal 3 Sätze.`;
  }
};

// Hauptkomponente
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
  const [generating, setGenerating] = useState(false);
  const [selectedModel, setSelectedModel] = useState("mistral-tiny");
  const [selectedStyle, setSelectedStyle] = useState("neutral");
  
  // Dialog-States
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
      NotyfService.showError("Bitte wähle eine Kategorie aus.");
      return;
    }
    
    setGenerating(true);
    try {
      // Optional: Bildinformationen extrahieren (falls vorhanden)
      let imageInfo = "";
      if (imageFile) {
        imageInfo = "mit hochgeladenem Bild";
      }
      
      // Prompt erstellen
      const prompt = generatePrompt(title, category, selectedStyle, imageInfo);
      
      // API-Anfrage an Mistral senden
      const response = await fetch(MISTRAL_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${MISTRAL_API_KEY}`,
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7, // Fester Wert statt variabel
        }),
      });
      
      // Antwort verarbeiten
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || "API-Anfrage fehlgeschlagen");
      }
      
      const generated = data.choices?.[0]?.message?.content;
      if (generated) {
        // Generierte Beschreibung im Dialog anzeigen
        setGeneratedDescription(generated.trim());
        setIsDialogOpen(true);
        NotyfService.showSuccess("Beschreibung erfolgreich generiert.");
      } else {
        throw new Error("Keine Beschreibung erhalten.");
      }
    } catch (err) {
      console.error(err);
      NotyfService.showError("Fehler bei der Generierung der Beschreibung.");
    } finally {
      setGenerating(false);
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
        
        <Textarea
          placeholder="Beschreibung"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
      </div>
      
      {/* KI-Beschreibungsgenerator */}
      <Card className="bg-gray-50 p-4">
        <Title className="text-lg">Beschreibung automatisch generieren</Title>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <Text>Modell</Text>
            <Select 
              value={selectedModel} 
              onValueChange={setSelectedModel}
            >
              {models.map((model) => (
                <SelectItem key={model.value} value={model.value}>
                  {model.name}
                </SelectItem>
              ))}
            </Select>
          </div>
          
          <div>
            <Text>Stil</Text>
            <Select 
              value={selectedStyle} 
              onValueChange={setSelectedStyle}
            >
              {styles.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  {style.name}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
        
        <Button 
          color="gray" 
          onClick={handleGenerateDescription} 
          loading={generating}
          className="mt-4 w-full"
        >
          {generating ? "Generiere..." : "Beschreibung generieren"}
        </Button>
      </Card>
      
      {/* Bildupload */}
      <div className="space-y-2">
        <Text>Bild hochladen</Text>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full text-sm"
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