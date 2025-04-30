// src/service/ItemService.ts
import NotyfService from "./NotyfService";
import { userService } from "./UserService";
import  User  from "../interfaces/User";
import  Item  from "../interfaces/Item";

class ItemService {
  private maxRetries: number;
  private baseUrl: string;

  constructor(maxRetries: number = 3) {
    this.maxRetries = maxRetries;
    this.baseUrl = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:3001";
  }

  async fetchAllItemsWithUsers(): Promise<any[]> {
    try {
      const token = userService.getToken();
      if (!token) throw new Error("Nicht eingeloggt.");

      const headers = { Authorization: `Bearer ${token}` };

      // Lade alle Nutzer
      const users: User[] = await this.getWithRetry("/users", headers);

      const allItems: any[] = [];

      const items: Item[] = await this.getWithRetry(`/items`, headers);

      const mapped = items.map((item: Item) => {
        const user = users.find(u => u.id === item.user_id); // Find the user for each item based on user_id
      
        return {
          category: item.category,
          title: item.title,
          entered_on: item.entered_on,
          username: user ? user.username : 'Unknown', // Handle case where user is not found
          image: item.image,
        };
      });
      
      allItems.push(...mapped);

      return allItems;
    } catch (err) {
      console.error(err);
      NotyfService.showError("Fehler beim Laden der Items.");
      return [];
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
