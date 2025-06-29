import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, TextInput, Textarea, Button, Title, Text, Dialog, DialogPanel, Flex, Badge } from "@tremor/react";
import { SparklesIcon, ArrowLeftIcon, PhotoIcon, TagIcon, DocumentTextIcon, EyeIcon, LockClosedIcon, CheckCircleIcon, XCircleIcon, CloudArrowUpIcon } from "@heroicons/react/24/outline";
import {TooltipProvider, Tooltip, TooltipTrigger, TooltipContent} from "@radix-ui/react-tooltip";
import { itemService } from "../../services/ItemService";
import { itemAssistantService } from "../../services/ItemAssistantService";
import NotyfService from "services/NotyfService";
import Loading from "components/helper/Loading";
import AlertDialog from "components/helper/AlertDialog";

type EditItemProps = {
  onNavigate: (route: string) => void;
};

export const EditItem = ({ onNavigate }: EditItemProps) => {
  // Get item ID from route params
  const { id } = useParams<{ id: string }>();

  // State for form fields and UI
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPrivate, setIsPrivate] = useState(false);

  // State for dialogs and AI description
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateConfirmOpen, setIsUpdateConfirmOpen] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState("");

  // Load item data on mount
  useEffect(() => {
    const loadItem = async () => {
      try {
        const item = await itemService.fetchItemById(parseInt(id!));
        setTitle(item.title ?? "");
        setCategory(item.category ?? "");
        setDescription(item.description ?? "");
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

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  // Handle item update (submit form)
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

  // Generate description using AI assistant
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
      const generatedText = await itemAssistantService.generateItemDescription(title, category);
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

  // Accept generated description
  const handleAcceptDescription = () => {
    setDescription(generatedDescription);
    setIsDialogOpen(false);
  };

  // Show loading spinner while fetching data
  if (isLoading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back navigation button */}
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

      {/* Hero header with title and subtitle */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl overflow-hidden shadow-2xl">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 right-8 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute bottom-4 left-8 w-16 h-16 bg-white rounded-full"></div>
        </div>
        <div className="relative p-8 text-white">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <DocumentTextIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <Title className="text-3xl font-bold text-white">Item bearbeiten</Title>
              <Text className="text-blue-100 text-lg">
                Aktualisieren Sie Ihr Kunstwerk oder Ihre Sammlung
              </Text>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form section for editing item details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic information card */}
          <Card>
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <TagIcon className="w-6 h-6 text-blue-600" />
                <Title className="text-xl">Grundinformationen</Title>
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
                </div>
                <div>
                  <Text className="font-medium mb-2 text-gray-700">Kategorie</Text>
                  <TextInput
                    placeholder="z.B. Malerei, Fotografie, Skulptur"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Description card with AI generation option */}
          <Card>
            <div className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                  <Title className="text-xl">Beschreibung</Title>
                  <Badge size="xs" color="blue">
                    Empfohlen
                  </Badge>
                </div>
                {/* Tooltip for AI description button */}
                <TooltipProvider>
                  <div className="sm:ml-auto">
                    {!title || !category ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>
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
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs p-4 bg-white border border-gray-200 shadow-lg rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div className="text-sm">
                              <p className="font-medium text-gray-800 mb-1">Fehlende Informationen</p>
                              <p className="text-gray-600 leading-relaxed">
                                {!title && !category 
                                  ? "Bitte fülle Titel und Kategorie aus, um eine KI-Beschreibung zu generieren."
                                  : !title 
                                  ? "Bitte fülle den Titel aus, um eine KI-Beschreibung zu generieren."
                                  : "Bitte fülle die Kategorie aus, um eine KI-Beschreibung zu generieren."
                                }
                              </p>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
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
                    )}
                  </div>
                </TooltipProvider>
              </div>
              <Textarea
                placeholder="Beschreiben Sie Ihr Item detailliert..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full"
              />
              <Text className="text-xs text-gray-500">
                Eine gute Beschreibung hilft anderen, Ihr Item besser zu verstehen.
              </Text>
            </div>
          </Card>

          {/* Privacy settings card */}
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
                        : "Alle Benutzer können dieses Item sehen"
                      }
                    </Text>
                  </div>
                </div>
                {/* Toggle for privacy */}
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

        {/* Sidebar: image upload, status, and actions */}
        <div className="space-y-6">
          {/* Image upload card */}
          <Card>
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <PhotoIcon className="w-6 h-6 text-blue-600" />
                <Title className="text-xl">Bild</Title>
              </div>
              <div className="space-y-4">
                {/* File input for image */}
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
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200"
                  >
                    <CloudArrowUpIcon className="w-8 h-8 text-gray-400 mb-2" />
                    <Text className="text-sm text-gray-600 text-center">
                      {imageFile ? "Neues Bild ausgewählt" : "Klicken zum Bild hochladen"}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      PNG, JPG, GIF bis 10MB
                    </Text>
                  </label>
                </div>
                {/* Image preview */}
                {(imageFile || existingImage) && (
                  <div className="space-y-2">
                    <Text className="text-sm font-medium text-gray-700">Vorschau:</Text>
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg border-2 border-gray-200">
                      <img
                        src={imageFile ? URL.createObjectURL(imageFile) : existingImage!}
                        alt="Vorschau"
                        className="w-full h-full object-cover"
                      />
                      {imageFile && (
                        <div className="absolute top-2 right-2">
                          <Badge color="green" icon={CheckCircleIcon} size="xs">
                            Neu
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Status card: shows which fields are filled */}
          <Card>
            <div className="p-6 space-y-4">
              <Title className="text-lg">Status</Title>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Text className="text-sm">Titel ausgefüllt</Text>
                  {title.trim() ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircleIcon className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <Text className="text-sm">Kategorie ausgefüllt</Text>
                  {category.trim() ? (
                   <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircleIcon className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <Text className="text-sm">Beschreibung vorhanden</Text>
                  {description.trim() ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircleIcon className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <Text className="text-sm">Bild hochgeladen</Text>
                  {(imageFile || existingImage) ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircleIcon className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Action buttons: save and cancel */}
          <div className="space-y-3">
            <Button 
              color="blue" 
              onClick={() => setIsUpdateConfirmOpen(true)} 
              size="lg" 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 border-0"
            >
              Änderungen speichern
            </Button>
            <Button
              variant="light"
              onClick={() => onNavigate("/items")}
              className="w-full"
            >
              Abbrechen
            </Button>
          </div>
        </div>
      </div>

      {/* Dialog for AI-generated description */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} static={true}>
        <DialogPanel className="max-w-2xl">
          <div className="p-6 space-y-6">
            <div className="flex items-center space-x-3">
              <SparklesIcon className="w-8 h-8 text-blue-600" />
              <Title className="text-xl">KI-generierte Beschreibung</Title>
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <Text className="leading-relaxed">{generatedDescription}</Text>
            </div>
            <Flex justifyContent="end" className="space-x-3">
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
                className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0"
              >
                Übernehmen
              </Button>
            </Flex>
          </div>
        </DialogPanel>
      </Dialog>
      
      {/* Dialog for editing item */}
      <AlertDialog
        open={isUpdateConfirmOpen}
        type={"update"}
        title="Änderungen speichern?"
        description="Bist du sicher, dass du die Änderungen an diesem Item speichern möchtest?"
        onClose={() => setIsUpdateConfirmOpen(false)}
        onConfirm={() => {
          setIsUpdateConfirmOpen(false);
          handleUpdate();
        }}
      />
    </div>
  );
};