import React, { useState } from "react";
import {
  Button,
  Card,
  TextInput,
  Textarea,
  Title,
  Text,
  Dialog,
  DialogPanel,
  Flex,
  Badge,
} from "@tremor/react";
import { 
  SparklesIcon, 
  ArrowLeftIcon,
  PhotoIcon,
  TagIcon,
  DocumentTextIcon,
  EyeIcon,
  LockClosedIcon,
  CheckCircleIcon,
  XCircleIcon,
  CloudArrowUpIcon,
  PlusIcon
} from "@heroicons/react/24/outline";
import { itemService } from "../../services/ItemService";
import { itemAssistantService } from "../../services/ItemAssistantService";
import NotyfService from "services/NotyfService";

type CreateItemProps = {
  onNavigate: (route: string) => void;
};

export const CreateItem = ({ onNavigate }: CreateItemProps) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      NotyfService.showError("Bitte gib einen Titel ein.");
      return;
    }

    setIsCreating(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("isprivate", isPrivate.toString());
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
    } finally {
      setIsCreating(false);
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
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAcceptDescription = () => {
    setDescription(generatedDescription);
    setIsDialogOpen(false);
  };

  const canCreate = title.trim().length > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <div className="flex items-center mb-6">
        <Button
          variant="light"
          icon={ArrowLeftIcon}
          onClick={() => onNavigate("/items")}
          className="mr-4"
        >
          Zurück zur Galerie
        </Button>
      </div>

      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 rounded-2xl overflow-hidden shadow-2xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 right-8 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute bottom-4 left-8 w-16 h-16 bg-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white rounded-full"></div>
        </div>
        
        <div className="relative p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <PlusIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <Title className="text-3xl font-bold text-white">Neues Item erstellen</Title>
                <Text className="text-green-100 text-lg">
                  Teilen Sie Ihr Kunstwerk oder Ihre Sammlung mit der Welt
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information Card */}
          <Card>
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <TagIcon className="w-6 h-6 text-emerald-600" />
                <Title className="text-xl">Grundinformationen</Title>
                <Badge size="xs" color="red">
                  Erforderlich
                </Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <Text className="font-medium mb-2 text-gray-700">Titel *</Text>
                  <TextInput
                    placeholder="Geben Sie einen aussagekräftigen Titel ein"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full"
                  />
                  <Text className="text-xs text-gray-500 mt-1">
                    Ein guter Titel macht Ihr Item leichter auffindbar
                  </Text>
                </div>

                <div>
                  <Text className="font-medium mb-2 text-gray-700">Kategorie</Text>
                  <TextInput
                    placeholder="z.B. Malerei, Fotografie, Skulptur, Vintage"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full"
                  />
                  <Text className="text-xs text-gray-500 mt-1">
                    Hilft anderen, ähnliche Items zu entdecken
                  </Text>
                </div>
              </div>
            </div>
          </Card>

          {/* Description Card */}
          <Card>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                  <Title className="text-xl">Beschreibung</Title>
                  <Badge size="xs" color="blue">
                    Empfohlen
                  </Badge>
                </div>
                <Button
                  icon={SparklesIcon}
                  size="xs"
                  color="blue"
                  onClick={handleGenerateDescription}
                  loading={isGenerating}
                  disabled={!title || !category}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 border-0 text-white"
                >
                  KI-Beschreibung
                </Button>
              </div>
              
              <Textarea
                placeholder="Erzählen Sie die Geschichte hinter diesem Item..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full"
              />
              
              <Text className="text-xs text-gray-500">
                Eine detaillierte Beschreibung macht Ihr Item interessanter und persönlicher.
              </Text>
            </div>
          </Card>

          {/* Privacy Settings Card */}
          <Card>
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                {isPrivate ? (
                  <LockClosedIcon className="w-6 h-6 text-red-600" />
                ) : (
                  <EyeIcon className="w-6 h-6 text-green-600" />
                )}
                <Title className="text-xl">Sichtbarkeitseinstellungen</Title>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${isPrivate ? 'bg-red-100' : 'bg-green-100'}`}>
                    {isPrivate ? (
                      <LockClosedIcon className="w-5 h-5 text-red-600" />
                    ) : (
                      <EyeIcon className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <div>
                    <Text className="font-medium">
                      {isPrivate ? "Privates Item" : "Öffentliches Item"}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {isPrivate 
                        ? "Nur Sie können dieses Item sehen" 
                        : "Alle Benutzer können dieses Item sehen und entdecken"
                      }
                    </Text>
                  </div>
                </div>
                
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isPrivate}
                    onChange={() => setIsPrivate(!isPrivate)}
                  />
                  <div className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                    isPrivate ? 'bg-red-500' : 'bg-green-500'
                  }`}>
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                      isPrivate ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </div>
                </label>
              </div>
            </div>
          </Card>
        </div>

        {/* Preview/Upload Section */}
        <div className="space-y-6">
          {/* Image Upload Card */}
          <Card>
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <PhotoIcon className="w-6 h-6 text-purple-600" />
                <Title className="text-xl">Bild hochladen</Title>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
                      imageFile 
                        ? 'border-green-400 bg-green-50 hover:bg-green-100' 
                        : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'
                    }`}
                  >
                    <CloudArrowUpIcon className={`w-12 h-12 mb-3 ${
                      imageFile ? 'text-green-500' : 'text-gray-400'
                    }`} />
                    <Text className={`text-sm text-center font-medium ${
                      imageFile ? 'text-green-700' : 'text-gray-600'
                    }`}>
                      {imageFile ? "Bild erfolgreich hochgeladen!" : "Klicken oder Dateien hierher ziehen"}
                    </Text>
                    <Text className="text-xs text-gray-500 mt-1">
                      PNG, JPG, GIF bis 10MB
                    </Text>
                  </label>
                </div>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Text className="text-sm font-medium text-gray-700">Vorschau:</Text>
                      <Badge color="green" icon={CheckCircleIcon} size="xs">
                        Geladen
                      </Badge>
                    </div>
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg border-2 border-green-200 shadow-lg">
                      <img
                        src={imagePreview}
                        alt="Vorschau"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Progress Card */}
          <Card>
            <div className="p-6 space-y-4">
              <Title className="text-lg flex items-center">
                Status
              </Title>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Text className="text-sm">Titel eingegeben</Text>
                  {title.trim() ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircleIcon className="w-5 h-5 text-red-500" />
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <Text className="text-sm">Kategorie festgelegt</Text>
                  {category.trim() ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircleIcon className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <Text className="text-sm">Beschreibung verfasst</Text>
                  {description.trim() ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircleIcon className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <Text className="text-sm">Bild hochgeladen</Text>
                  {imageFile ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircleIcon className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              color="emerald" 
              onClick={handleCreate} 
              size="lg" 
              className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 border-0"
              disabled={!canCreate}
              loading={isCreating}
            >
              {isCreating ? "Item wird erstellt..." : "Item erstellen"}
            </Button>
            
            <Button
              variant="light"
              onClick={() => onNavigate("/items")}
              className="w-full"
              disabled={isCreating}
            >
              Abbrechen
            </Button>
          </div>
        </div>
      </div>

      {/* AI Description Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} static={true}>
        <DialogPanel className="max-w-2xl">
          <div className="p-6 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                <SparklesIcon className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <Title className="text-xl">KI-generierte Beschreibung</Title>
                <Text className="text-gray-600">Basierend auf Titel und Kategorie</Text>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-xl border border-blue-200">
              <Text className="leading-relaxed text-gray-800">{generatedDescription}</Text>
            </div>

            <Flex justifyContent="end" className="space-x-3">
              <Button
                color="gray"
                onClick={() => {
                  setIsDialogOpen(false);
                  handleGenerateDescription();
                }}
                icon={SparklesIcon}
              >
                Neu generieren
              </Button>
              <Button 
                color="blue" 
                onClick={handleAcceptDescription}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0"
                icon={CheckCircleIcon}
              >
                Übernehmen
              </Button>
            </Flex>
          </div>
        </DialogPanel>
      </Dialog>
    </div>
  );
};