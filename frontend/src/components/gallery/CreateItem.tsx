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
  const [enteredOn, setEnteredOn] = useState("");

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
      formData.append("entered_on", enteredOn);
      if (imageFile) formData.append("image", imageFile);

      await itemService.createItem(formData);
      NotyfService.showSuccess("Item created successfully.");
      onNavigate('/items')
    } catch (err) {
      NotyfService.showError("Error creating item.");
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

        <input
          type="date"
          value={enteredOn}
          onChange={(e) => setEnteredOn(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-full"
        />
      </div>

      <Button color="blue" onClick={handleCreate}>
        Liste erstellen
      </Button>
    </Card>
  );
};
