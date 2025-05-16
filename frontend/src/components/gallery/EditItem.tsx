import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, TextInput, Textarea, Button, Title, Text } from "@tremor/react";
import { itemService } from "../../services/ItemService";
import NotyfService from "services/NotyfService";
import { GalleryItem } from "interfaces/Item";
import { userService } from "services/UserService";
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

  useEffect(() => {
    const loadItem = async () => {
      try {
        const item = await itemService.fetchItemById(parseInt(id!));
        setTitle(item.title);
        setCategory(item.category);
        setDescription(item.description);
        setExistingImage(item.image); // assuming image is a URL string
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
      if (imageFile) formData.append("image", imageFile);

      await itemService.updateItem(parseInt(id!), formData);
      NotyfService.showSuccess("Item successfully updated.");
      onNavigate("/items");
    } catch (error) {
      let errorMessage = "Fehler beim Aktualisieren des Items";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      NotyfService.showError(errorMessage);
    }
  };

  if (isLoading) return <Loading />

  return (
    <Card className="max-w-2xl mx-auto mt-6 space-y-4">
      <Title>Item bearbeiten</Title>
      <div className="space-y-4">
        <TextInput placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <TextInput placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
        <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />

        <div className="space-y-2">
          <Text className="font-medium">Wähle ein neues Image</Text>
          <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm" />
        </div>

        {(imageFile || existingImage) && (
          <div className="pt-4">
            <Text className="text-sm text-gray-600 mb-2">Vorschau:</Text>
            <img
              src={imageFile ? URL.createObjectURL(imageFile) : existingImage!}
              alt="Preview"
              className="max-w-full h-auto rounded shadow"
            />
          </div>
        )}
      </div>

      <Button color="blue" onClick={handleUpdate}>
        Änderungen speichern
      </Button>
    </Card>
  );
};
