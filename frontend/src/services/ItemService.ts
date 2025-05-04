import NotyfService from "./NotyfService";
import { userService } from "./UserService";
import User from "../interfaces/User";
import Item, { GalleryItem } from "../interfaces/Item";
import ItemList from "interfaces/ItemList";

class ItemService {
  private maxRetries: number;
  private baseUrl: string;

  constructor(maxRetries: number = 3) {
    this.maxRetries = maxRetries;
    this.baseUrl = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:3001";
  }

  async fetchAllItemsWithUsers(): Promise<any[]> {
    const token = userService.getToken();
    if (!token) throw new Error("Nicht eingeloggt.");

    const headers = { Authorization: `Bearer ${token}` };

    const users: User[] = await this.getWithRetry("/users", headers);

    const allItems: any[] = [];

    const items: Item[] = await this.getWithRetry(`/items`, headers);

    const mapped = items.map((item: Item) => {
      const user = users.find(u => u.id === item.user_id); // Find the user for each item based on user_id

      return {
        id: item.id,
        category: item.category,
        title: item.title,
        entered_on: item.entered_on,
        username: user ? user.username : 'Unknown', // Handle case where user is not found
        image: item.image,
      };
    });

    allItems.push(...mapped);

    return allItems;
  }

  async fetchOwnItems(): Promise<Item[]> {
    const token = userService.getToken();
    const userID = userService.getUserID(); // Assumes this returns the logged-in user
    if (!token || !userID) throw new Error("Nicht eingeloggt.");
  
    const headers = { Authorization: `Bearer ${token}` };
  
    const res = await fetch(`${this.baseUrl}/items?user_id=${userID}`, {
      method: "GET",
      headers,
    });
  
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Fehler beim Laden der eigenen Items: ${errorText}`);
    }
  
    return await res.json();
  }

  async fetchItemById(itemId: number): Promise<GalleryItem> {
    const token = userService.getToken();
    const userID = userService.getUserID();

    if (!token || !userID) {
      throw new Error("Nicht eingeloggt.");
    }

    const headers = { Authorization: `Bearer ${token}` };

    try {
      // Fetch the item with the user data using the item ID
      const res = await fetch(`${this.baseUrl}/items/${itemId}`, {
        method: "GET",
        headers,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Fehler beim Laden des Items: ${errorText}`);
      }

      // Parse the response JSON into a GalleryItem type
      const item: GalleryItem = await res.json();
      return item;
    } catch (error) {
      console.error(error);
      throw new Error("Fehler beim Laden des Items und Benutzerinformationen.");
    }
  }
  

  async fetchItemLists(): Promise<ItemList[]> {
    const token = userService.getToken();
    if (!token) throw new Error("Nicht eingeloggt.");

    const headers = { Authorization: `Bearer ${token}` };
    return await this.getWithRetry<ItemList[]>("/item-lists", headers);
  }

  async fetchItemListById(id: string): Promise<ItemList> {
    const token = userService.getToken();
    if (!token) throw new Error("Nicht eingeloggt.");
  
    const headers = { Authorization: `Bearer ${token}` };
    return await this.getWithRetry<ItemList>(`/item-lists/${id}`, headers);
  }

  // New function to fetch items by item_list_id
  async fetchItemsByItemListId(itemListId: number): Promise<GalleryItem[]> {
    const token = userService.getToken();
    if (!token) throw new Error("Nicht eingeloggt.");

    const headers = { Authorization: `Bearer ${token}` };

    // Fetch items for the specific item list
    try {
      const res = await fetch(`${this.baseUrl}/item-lists/${itemListId}/items`, {
        method: "GET",
        headers,
      });

      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(`Fehler beim Laden der Items: ${errorMessage}`);
      }

      const items = await res.json();

      const users: User[] = await this.getWithRetry("/users", headers);

      const mapped: GalleryItem[] = items.map((item: Item) => {
        const user = users.find(u => u.id === item.user_id); // Find the user for each item based on user_id

        return {
          category: item.category,
          title: item.title,
          entered_on: item.entered_on,
          username: user ? user.username : 'Unknown', // Handle case where user is not found
          image: item.image,
        };
      });

      return mapped
    } catch (err: any) {
      console.error("Fehler beim Abrufen der Items:", err);
      throw new Error(err.message || "Unbekannter Fehler beim Abrufen der Items.");
    }
  }

  async createItem(formData: FormData): Promise<any> {
    const token = userService.getToken();
    if (!token) throw new Error("Nicht eingeloggt.");
  
    try {
      const res = await fetch(`${this.baseUrl}/items`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // DO NOT set "Content-Type"; browser will set it with boundary for multipart/form-data
        },
        body: formData,
      });
  
      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(`Fehler beim Erstellen: ${errorMessage}`);
      }
  
      return await res.json();
    } catch (err: any) {
      console.error("Item creation failed:", err);
      throw new Error(err.message || "Unbekannter Fehler beim Erstellen des Items.");
    }
  }
  

  async createItemList(data: {
    title: string;
    description?: string;
    item_ids: number[];
  }): Promise<any> {
    const token = userService.getToken();
    if (!token) throw new Error("Nicht eingeloggt.");

    try {
      // Sending the POST request to create a new item list
      const res = await fetch(`${this.baseUrl}/item-lists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      // Handling errors if the response is not ok
      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(`Fehler beim Erstellen der Liste: ${errorMessage}`);
      }

      // Return the response data (the created item list)
      const createdItemList = await res.json();
      return createdItemList;
    } catch (err: any) {
      console.error("Item list creation failed:", err);
      throw new Error(err.message || "Unbekannter Fehler beim Erstellen der Item-Liste.");
    }
  }

  private async getWithRetry<T>(endpoint: string, headers: Record<string, string>): Promise<T> {
    let attempts = 0;
    while (attempts < this.maxRetries) {
      try {
        const res = await fetch(`${this.baseUrl}${endpoint}`, {
          method: "GET",
          headers,
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          throw new Error(errorData?.error || `HTTP ${res.status}`);
        }

        return await res.json();
      } catch (err) {
        attempts += 1;
        console.warn(`GET ${endpoint} failed (attempt ${attempts}):`, err);
        if (attempts >= this.maxRetries) {
          throw new Error(`Fehlgeschlagen nach ${this.maxRetries} Versuchen: ${err}`);
        }
      }
    }

    throw new Error("Unerwarteter Fehler bei getWithRetry.");
  }
}

export const itemService = new ItemService();
