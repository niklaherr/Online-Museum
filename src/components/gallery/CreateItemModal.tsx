import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Button, TextInput, Textarea } from "@tremor/react";
import { itemService } from "../../services/ItemService";
import NotyfService from "services/NotyfService";

type CreateItemModalProps = {
  onClose: () => void;
  onItemCreated: () => void;
};

export const CreateItemModal = ({ onClose, onItemCreated }: CreateItemModalProps) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [enteredOn, setEnteredOn] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file); // Converts to base64 string
    }
  };

  const handleCreate = async () => {
    try {
      await itemService.createItem({
        title,
        category,
        description,
        image: imageBase64, // base64-encoded string
        entered_on: enteredOn,
      });

      NotyfService.showSuccess("Item created successfully.");
      onItemCreated();
      onClose();
    } catch (err) {
      NotyfService.showError("Error creating item.");
    }
  };

  return (
    <Dialog open={true} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Panel className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <Dialog.Title className="text-xl font-semibold mb-4">Add New Item</Dialog.Title>
          <div className="space-y-4">
            <TextInput placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <TextInput placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
            <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />

            {/* File input for image (base64 conversion) */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm"
            />

            <input
              type="date"
              value={enteredOn}
              onChange={(e) => setEnteredOn(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full"
            />
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Button onClick={onClose} variant="light">
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create</Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
