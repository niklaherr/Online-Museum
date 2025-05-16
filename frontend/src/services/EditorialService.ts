import NotyfService from "./NotyfService";
import { userService } from "./UserService";
import { GalleryItem } from "../interfaces/Item";
import Editorial from "interfaces/Editorial";

class EditorialService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:3001";
  }

  // Fetch all editorial lists
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

  // Fetch a specific editorial list by ID
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

  // Search for items across all users
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

  // Create a new editorial list
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

  // Update an existing editorial list
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

  // Delete an editorial list
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

  // Check if current user is an admin
  async isAdmin(): Promise<boolean> {
    const token = userService.getToken();
    if (!token) return false;

    try {
      const res = await fetch(`${this.baseUrl}/users/me/permissions`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        userService.logout();
        return false;
      }

      if (!res.ok) return false;

      const data = await res.json();
      return data.isAdmin === true;
    } catch (err) {
      return false;
    }
  }
}

export const editorialService = new EditorialService();
