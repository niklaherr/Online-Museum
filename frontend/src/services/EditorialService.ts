import { userService } from "./UserService";
import { GalleryItem } from "../interfaces/Item";
import Editorial from "interfaces/Editorial";

// Service for handling editorial list API requests
class EditorialService {
  private baseUrl: string;

  constructor() {
    // Set base URL from environment or fallback to localhost
    this.baseUrl = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:3001";
  }

  // Fetch all editorial lists from the backend
  async fetchEditorialLists(): Promise<Editorial[]> {
    const token = userService.getToken();
    if (!token) throw new Error("Nicht eingeloggt.");

    const headers = { Authorization: `Bearer ${token}` };

    try {
      const res = await fetch(`${this.baseUrl}/editorial-lists`, {
        method: "GET",
        headers,
      });

      if (res.status === 401) {
        userService.logout();
        throw new Error("Nicht autorisiert. Sie wurden ausgeloggt.");
      }

      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(`Fehler beim Laden der Redaktionslisten: ${errorMessage}`);
      }

      return await res.json();
    } catch (err: any) {
      throw new Error(err.message || "Unbekannter Fehler beim Abrufen der Redaktionslisten.");
    }
  }

  // Fetch a specific editorial list by its ID
  async fetchEditorialListById(id: string): Promise<Editorial> {
    const token = userService.getToken();
    if (!token) throw new Error("Nicht eingeloggt.");
  
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const res = await fetch(`${this.baseUrl}/editorial-lists/${id}`, {
        method: "GET",
        headers,
      });

      if (res.status === 401) {
        userService.logout();
        throw new Error("Nicht autorisiert. Sie wurden ausgeloggt.");
      }

      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(`Fehler beim Laden der Redaktionsliste: ${errorMessage}`);
      }

      return await res.json();
    } catch (err: any) {
      throw new Error(err.message || "Unbekannter Fehler beim Abrufen der Redaktionsliste.");
    }
  }

  // Fetch all items belonging to a specific editorial list
  async fetchItemsByEditorialId(editorialId: number): Promise<GalleryItem[]> {
    const token = userService.getToken();
    if (!token) throw new Error("Nicht eingeloggt.");

    const headers = { Authorization: `Bearer ${token}` };

    try {
      const res = await fetch(`${this.baseUrl}/editorial-lists/${editorialId}/items`, {
        method: "GET",
        headers,
      });

      if (res.status === 401) {
        userService.logout(); // Perform logout on unauthorized
        throw new Error("Nicht autorisiert. Sie wurden ausgeloggt.");
      }
    
      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(`Fehler beim Laden der Items: ${errorMessage}`);
      }

      const items: GalleryItem[] = await res.json();

      return items;
    } catch (err: any) {
      throw new Error(err.message || "Unbekannter Fehler beim Abrufen der Items.");
    }
  }

  // Search for items across all users by query string
  async searchItems(query: string): Promise<GalleryItem[]> {
    const token = userService.getToken();
    if (!token) throw new Error("Nicht eingeloggt.");

    const headers = { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json" 
    };

    try {
      const res = await fetch(`${this.baseUrl}/items-search?q=${encodeURIComponent(query)}`, {
        method: "GET",
        headers,
      });

      if (res.status === 401) {
        userService.logout();
        throw new Error("Nicht autorisiert. Sie wurden ausgeloggt.");
      }

      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(`Fehler bei der Suche nach Items: ${errorMessage}`);
      }

      return await res.json();
    } catch (err: any) {
      throw new Error(err.message || "Unbekannter Fehler bei der Suche nach Items.");
    }
  }

  // Create a new editorial list with given data
  async createEditorialList(data: {
    title: string;
    description?: string;
    item_ids: number[];
  }): Promise<Editorial> {
    const token = userService.getToken();
    if (!token) throw new Error("Nicht eingeloggt.");

    try {
      const res = await fetch(`${this.baseUrl}/editorial-lists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (res.status === 401) {
        userService.logout();
        throw new Error("Nicht autorisiert. Sie wurden ausgeloggt.");
      }

      if (res.status === 403) {
        throw new Error("Sie haben keine Berechtigung, redaktionelle Listen zu erstellen.");
      }

      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(`Fehler beim Erstellen der Redaktionsliste: ${errorMessage}`);
      }

      return await res.json();
    } catch (err: any) {
      throw new Error(err.message || "Unbekannter Fehler beim Erstellen der Redaktionsliste.");
    }
  }

  // Update an existing editorial list by ID
  async updateEditorialList(id: number, data: {
    title: string;
    description?: string;
    item_ids: number[];
  }): Promise<Editorial> {
    const token = userService.getToken();
    if (!token) throw new Error("Nicht eingeloggt.");
  
    try {
      const res = await fetch(`${this.baseUrl}/editorial-lists/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (res.status === 401) {
        userService.logout();
        throw new Error("Nicht autorisiert. Sie wurden ausgeloggt.");
      }

      if (res.status === 403) {
        throw new Error("Sie haben keine Berechtigung, redaktionelle Listen zu bearbeiten.");
      }
    
      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(`Fehler beim Bearbeiten der Redaktionsliste: ${errorMessage}`);
      }
  
      return await res.json();
    } catch (err: any) {
      throw new Error(err.message || "Unbekannter Fehler beim Bearbeiten der Redaktionsliste.");
    }
  }

  // Delete an editorial list by ID
  async deleteEditorialList(id: number): Promise<void> {
    const token = userService.getToken();
    if (!token) throw new Error("Nicht eingeloggt.");

    try {
      const res = await fetch(`${this.baseUrl}/editorial-lists/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        userService.logout();
        throw new Error("Nicht autorisiert. Sie wurden ausgeloggt.");
      }

      if (res.status === 403) {
        throw new Error("Sie haben keine Berechtigung, redaktionelle Listen zu löschen.");
      }

      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(`Fehler beim Löschen der Redaktionsliste: ${errorMessage}`);
      }
    } catch (err: any) {
      throw new Error(err.message || "Unbekannter Fehler beim Löschen der Redaktionsliste.");
    }
  }
}

// Export a singleton instance of the EditorialService
export const editorialService = new EditorialService();
