import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Button, Card, TextInput, Textarea, Title } from "@tremor/react";
import { itemService } from "../../services/ItemService";
import NotyfService from "services/NotyfService";

type CreateItemProps = {
  onNavigate: (route: string) => void;
};
export const CreateItem = ({ onNavigate }: CreateItemProps) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleCreate = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("description", description);
      if (imageFile) formData.append("image", imageFile);

      await itemService.createItem(formData);
      NotyfService.showSuccess("Item created successfully.");
      onNavigate('/items')
    } catch (error) {
      let errorMessage = "Fehler beim Erstellen eines Items"
      if(error instanceof Error) {
        errorMessage = error.message
      }
      NotyfService.showError(errorMessage)
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mt-6 space-y-4">
      <Title>Neues Item erstellen</Title>
      <div className="space-y-4">
        <TextInput placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <TextInput placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
        <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />

        <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm" />
      </div>

      <Button color="blue" onClick={handleCreate}>
        Liste erstellen
      </Button>
    </Card>
  );
};
