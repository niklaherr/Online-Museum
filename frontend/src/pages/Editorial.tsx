import React, { useState, ChangeEvent, FormEvent } from "react";
import {
  Card,
  Title,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Button,
  TextInput,
  Flex,
} from "@tremor/react";

interface MuseumItem {
  id: number;
  name: string;
  category: string;
  year: number;
}

const initialMuseumData: MuseumItem[] = [
  { id: 1, name: "Mona Lisa", category: "Painting", year: 1503 },
  { id: 2, name: "Rosetta Stone", category: "Artifact", year: -196 },
  { id: 3, name: "The Thinker", category: "Sculpture", year: 1904 },
];

export default function MuseumEditorial(): JSX.Element {
  const [items, setItems] = useState<MuseumItem[]>(initialMuseumData);
  const [isEditingId, setIsEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<{ name: string; category: string; year: string }>({
    name: "",
    category: "",
    year: "",
  });

  // Start adding new item
  const startAddNew = (): void => {
    setIsEditingId(0); // 0 means adding new
    setFormData({ name: "", category: "", year: "" });
  };

  // Start editing an existing item
  const startEdit = (item: MuseumItem): void => {
    setIsEditingId(item.id);
    setFormData({ name: item.name, category: item.category, year: item.year.toString() });
  };

  // Cancel add/edit
  const cancelEdit = (): void => {
    setIsEditingId(null);
    setFormData({ name: "", category: "", year: "" });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (): void => {
    if (!formData.name || !formData.category || !formData.year) {
      alert("Please fill in all fields");
      return;
    }

    const yearNum = Number(formData.year);
    if (isNaN(yearNum)) {
      alert("Year must be a number");
      return;
    }

    if (isEditingId && isEditingId !== 0) {
      // Update existing
      setItems((prev) =>
        prev.map((item) =>
          item.id === isEditingId
            ? { ...item, name: formData.name, category: formData.category, year: yearNum }
            : item
        )
      );
    } else {
      // Create new
      const newItem: MuseumItem = {
        id: Date.now(),
        name: formData.name,
        category: formData.category,
        year: yearNum,
      };
      setItems((prev) => [...prev, newItem]);
    }
    cancelEdit();
  };

  const handleDelete = (id: number): void => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      if (isEditingId === id) cancelEdit();
    }
  };

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    handleSave();
  };

  return (
    <Card>
      <Flex justifyContent="between" alignItems="center">
        <Title>Museum Editorial Page</Title>
        {isEditingId === null && (
          <Button onClick={startAddNew}>Add New Item</Button>
        )}
      </Flex>

      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Category</TableHeaderCell>
            <TableHeaderCell>Year</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {items.map(({ id, name, category, year }) => (
            <TableRow key={id}>
              {isEditingId === id ? (
                <>
                  <TableCell>
                    <TextInput
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Name"
                      required
                    />
                  </TableCell>
                  <TableCell>
                    <TextInput
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      placeholder="Category"
                      required
                    />
                  </TableCell>
                  <TableCell>
                    <TextInput
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      placeholder="Year"
                      type="number"
                      required
                    />
                  </TableCell>
                  <TableCell>
                    <Flex>
                      <Button size="xs" onClick={handleSave}>Save</Button>
                      <Button size="xs" variant="secondary" onClick={cancelEdit}>Cancel</Button>
                    </Flex>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>{name}</TableCell>
                  <TableCell>{category}</TableCell>
                  <TableCell>{year}</TableCell>
                  <TableCell>
                    <Flex>
                      <Button size="xs" onClick={() => startEdit({ id, name, category, year })}>
                        Edit
                      </Button>
                      <Button size="xs" onClick={() => handleDelete(id)}>
                        Delete
                      </Button>
                    </Flex>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}

          {/* Inline form row for adding new item */}
          {isEditingId === 0 && (
            <TableRow>
              <TableCell>
                <TextInput
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  required
                />
              </TableCell>
              <TableCell>
                <TextInput
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Category"
                  required
                />
              </TableCell>
              <TableCell>
                <TextInput
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="Year"
                  type="number"
                  required
                />
              </TableCell>
              <TableCell>
                <Flex>
                  <Button size="xs" onClick={handleSave}>Create</Button>
                  <Button size="xs" variant="secondary" onClick={cancelEdit}>Cancel</Button>
                </Flex>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
