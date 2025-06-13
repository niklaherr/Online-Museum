import { userService } from "./UserService";
import Item, { GalleryItem } from "../interfaces/Item";
import ItemList from "interfaces/ItemList";
import Activity from "interfaces/Activity";
import DateCount from "interfaces/DateCount";

// Service class for handling item-related API calls
class ItemService {
  private maxRetries: number;
  private baseUrl: string;

  constructor(maxRetries: number = 3) {
    this.maxRetries = maxRetries;
    // Set base URL from environment or fallback to localhost
    this.baseUrl = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:3001";
  }

  // Fetch items for the landing page (public, no auth required)
  async fetchLandingPageItems(): Promise<any[]> {
    try {
      const res = await fetch(`${this.baseUrl}/items/no-auth`, {
        method: "GET",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Fehler beim Laden des Items: ${errorText}`);
      }

      const item: GalleryItem[] = await res.json();
      return item;
    } catch (error) {
      throw new Error("Fehler beim Laden der Items");
    }
  }

  // Fetch public item lists (excluding current user)
  async fetchPublicLists(): Promise<GalleryItem[]> {
    const token = userService.getToken();
    const userID = userService.getUserID();
    if (!token || !userID) throw new Error("Nicht eingeloggt.");

    const headers = { Authorization: `Bearer ${token}` };

    const url = new URL(`${this.baseUrl}/item-lists`);
    url.searchParams.append("exclude_user_id", userID.toString());

    const res = await fetch(url.toString(), {
      method: "GET",
      headers,
    });

    if (res.status === 401) {
      userService.logout(); // Logout on unauthorized
      throw new Error("Nicht autorisiert. Sie wurden ausgeloggt.");
    }

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Fehler beim Laden der eigenen Items: ${errorText}`);
    }
    return await res.json();
  }

  // Fetch item lists owned by the current user
  async fetchUserLists(): Promise<GalleryItem[]> {
    const token = userService.getToken();
    const userID = userService.getUserID();
    if (!token || !userID) throw new Error("Nicht eingeloggt.");

    const headers = { Authorization: `Bearer ${token}` };

    const url = new URL(`${this.baseUrl}/item-lists`);
    url.searchParams.append("user_id", userID.toString());

    const res = await fetch(url.toString(), {
      method: "GET",
      headers,
    });

    if (res.status === 401) {
      userService.logout(); // Logout on unauthorized
      throw new Error("Nicht autorisiert. Sie wurden ausgeloggt.");
    }

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Fehler beim Laden der eigenen Items: ${errorText}`);
    }
    return await res.json();
  }

  // Fetch items owned by the current user
  async fetchOwnItems(): Promise<GalleryItem[]> {
    const token = userService.getToken();
    const userID = userService.getUserID();
    if (!token || !userID) throw new Error("Nicht eingeloggt.");

    const headers = { Authorization: `Bearer ${token}` };

    const url = new URL(`${this.baseUrl}/items`);
    url.searchParams.append("user_id", userID.toString());

    const res = await fetch(url.toString(), {
      method: "GET",
      headers,
    });

    if (res.status === 401) {
      userService.logout(); // Logout on unauthorized
      throw new Error("Nicht autorisiert. Sie wurden ausgeloggt.");
    }

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Fehler beim Laden der eigenen Items: ${errorText}`);
    }

    return await res.json();
  }

  // Fetch a single item by its ID
  async fetchItemById(itemId: number): Promise<GalleryItem> {
    const token = userService.getToken();
    const userID = userService.getUserID();

    if (!token || !userID) {
      throw new Error("Nicht eingeloggt.");
    }

    const headers = { Authorization: `Bearer ${token}` };

    try {
      const res = await fetch(`${this.baseUrl}/items/${itemId}`, {
        method: "GET",
        headers,
      });

      if (res.status === 401) {
        userService.logout(); // Logout on unauthorized
        throw new Error("Nicht autorisiert. Sie wurden ausgeloggt.");
      }

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Fehler beim Laden des Items: ${errorText}`);
      }

      const item: GalleryItem = await res.json();
      return item;
    } catch (error) {
      throw new Error("Fehler beim Laden des Items und Benutzerinformationen.");
    }
  }

  // Fetch items not owned by the current user (public items)
  async fetchItemsNotOwnedByUser(): Promise<GalleryItem[]> {
    const token = userService.getToken();
    const userID = userService.getUserID();
    if (!token || !userID) throw new Error("Nicht eingeloggt.");

    const headers = { Authorization: `Bearer ${token}` };

    const url = new URL(`${this.baseUrl}/items`);
    url.searchParams.append("exclude_user_id", userID.toString());
    url.searchParams.append("isprivate", false.toString());

    const res = await fetch(url.toString(), {
      method: "GET",
      headers,
    });

    if (res.status === 401) {
      userService.logout();
      throw new Error("Nicht autorisiert. Sie wurden ausgeloggt.");
    }

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Fehler beim Laden der fremden Items: ${errorText}`);
    }

    return await res.json();
  }

  // Fetch a single item list by its ID
  async fetchItemListById(id: string): Promise<ItemList> {
    const token = userService.getToken();
    if (!token) throw new Error("Nicht eingeloggt.");

    const headers = { Authorization: `Bearer ${token}` };
    try {
      const res = await fetch(`${this.baseUrl}/item-lists/${id}`, {
        method: "GET",
        headers,
      });

      if (res.status === 401) {
        userService.logout(); // Logout on unauthorized
        throw new Error("Nicht autorisiert. Sie wurden ausgeloggt.");
      }

      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(`Fehler beim Laden der Item-Liste: ${errorMessage}`);
      }

      return await res.json();
    } catch (err: any) {
      throw new Error(err.message || "Unbekannter Fehler beim Abrufen der Item-Liste.");
    }
  }

  // Fetch all items belonging to a specific item list
  async fetchItemsByItemListId(itemListId: number): Promise<GalleryItem[]> {
    const token = userService.getToken();
    if (!token) throw new Error("Nicht eingeloggt.");

    const headers = { Authorization: `Bearer ${token}` };

    try {
      const res = await fetch(`${this.baseUrl}/item-lists/${itemListId}/items`, {
        method: "GET",
        headers,
      });

      if (res.status === 401) {
        userService.logout(); // Logout on unauthorized
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

  // Fetch all activities for the current user
  async fetchActivities(): Promise<Activity[]> {
    const token = userService.getToken();
    if (!token) throw new Error("Nicht eingeloggt.");

    const headers = { Authorization: `Bearer ${token}` };

    try {
      const res = await fetch(`${this.baseUrl}/activities`, {
        method: "GET",
        headers,
      });

      if (res.status === 401) {
        userService.logout(); // Logout on unauthorized
        throw new Error("Nicht autorisiert. Sie wurden ausgeloggt.");
      }

      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(`Fehler beim Laden der Aktivitäten: ${errorMessage}`);
      }

      const activities: Activity[] = await res.json();

      return activities;
    } catch (err: any) {
      throw new Error(err.message || "Unbekannter Fehler beim Abrufen der Aktivitäten.");
    }
  }

  // Create a new item (with file upload support)
  async createItem(formData: FormData): Promise<any> {
    const token = userService.getToken();
    if (!token) throw new Error("Nicht eingeloggt.");

    try {
      const res = await fetch(`${this.baseUrl}/items`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.status === 401) {
        userService.logout(); // Logout on unauthorized
        throw new Error("Nicht autorisiert. Sie wurden ausgeloggt.");
      }

      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(`Fehler beim Erstellen: ${errorMessage}`);
      }

      return await res.json();
    } catch (err: any) {
      throw new Error(err.message || "Unbekannter Fehler beim Erstellen des Items.");
    }
  }

  // Update an existing item (with file upload support)
  async updateItem(id: number, formData: FormData): Promise<any> {
    const token = userService.getToken();
    if (!token) throw new Error("Nicht eingeloggt.");

    try {
      const res = await fetch(`${this.baseUrl}/items/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.status === 401) {
        userService.logout(); // Logout on unauthorized
        throw new Error("Nicht autorisiert. Sie wurden ausgeloggt.");
      }

      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(`Fehler beim Aktualisieren: ${errorMessage}`);
      }

      return await res.json();
    } catch (err: any) {
      throw new Error(err.message || "Unbekannter Fehler beim Aktualisieren des Items.");
    }
  }

  // Delete an item by its ID
  async deleteItem(id: number): Promise<any> {
    const token = userService.getToken();
    if (!token) throw new Error("Nicht eingeloggt.");

    try {
      const res = await fetch(`${this.baseUrl}/items/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        userService.logout(); // Logout on unauthorized
        throw new Error("Nicht autorisiert. Sie wurden ausgeloggt.");
      }

      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(`Fehler beim Löschen der Liste: ${errorMessage}`);
      }

      return await res; // Optionally handle response from backend
    } catch (err: any) {
      throw new Error(err.message || "Unbekannter Fehler beim Löschen der Item-Liste.");
    }
  }

  // Create a new item list (with file upload support)
  async createItemList(data: {
    title: string;
    description?: string;
    item_ids: number[];
    is_private: boolean;
    main_image?: File;
  }): Promise<any> {
    const token = userService.getToken();
    if (!token) throw new Error("Nicht eingeloggt.");

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description || "");
      formData.append("item_ids", JSON.stringify(data.item_ids));
      formData.append("is_private", data.is_private.toString());

      if (data.main_image) {
        formData.append("main_image", data.main_image);
      }

      const res = await fetch(`${this.baseUrl}/item-lists`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.status === 401) {
        userService.logout(); // Logout on unauthorized
        throw new Error("Nicht autorisiert. Sie wurden ausgeloggt.");
      }

      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(`Fehler beim Erstellen der Liste: ${errorMessage}`);
      }

      const createdItemList = await res.json();
      return createdItemList;
    } catch (err: any) {
      throw new Error(err.message || "Unbekannter Fehler beim Erstellen der Item-Liste.");
    }
  }

  // Edit an existing item list (with file upload support)
  async editItemList(id: number, data: {
    title: string;
    description?: string;
    item_ids: number[];
    is_private: boolean;
    main_image?: File;
  }): Promise<any> {
    const token = userService.getToken();
    if (!token) throw new Error("Nicht eingeloggt.");

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description || "");
      formData.append("item_ids", JSON.stringify(data.item_ids));
      formData.append("is_private", data.is_private.toString());

      if (data.main_image) {
        formData.append("main_image", data.main_image);
      }

      const res = await fetch(`${this.baseUrl}/item-lists/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.status === 401) {
        userService.logout(); // Logout on unauthorized
        throw new Error("Nicht autorisiert. Sie wurden ausgeloggt.");
      }

      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(`Fehler beim Bearbeiten der Liste: ${errorMessage}`);
      }

      return await res.json();
    } catch (err: any) {
      throw new Error(err.message || "Unbekannter Fehler beim Bearbeiten der Item-Liste.");
    }
  }

  // Delete an item list by its ID
  async deleteItemList(id: number): Promise<any> {
    const token = userService.getToken();
    if (!token) throw new Error("Nicht eingeloggt.");

    try {
      const res = await fetch(`${this.baseUrl}/item-lists/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        userService.logout(); // Logout on unauthorized
        throw new Error("Nicht autorisiert. Sie wurden ausgeloggt.");
      }

      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(`Fehler beim Löschen der Liste: ${errorMessage}`);
      }

      return await res; // Optionally handle response from backend
    } catch (err: any) {
      throw new Error(err.message || "Unbekannter Fehler beim Löschen der Item-Liste.");
    }
  }

  // Count item lists per day for the current user
  async fetchItemListDataCounting(): Promise<DateCount[]> {
    const token = userService.getToken();
    const userID = userService.getUserID();
    if (!token || !userID) throw new Error("Nicht eingeloggt.");

    const headers = { Authorization: `Bearer ${token}` };
    try {
      const url = new URL(`${this.baseUrl}/item-lists`);
      url.searchParams.append("user_id", userID.toString());

      const res = await fetch(url.toString(), {
        method: "GET",
        headers,
      });

      if (res.status === 401) {
        userService.logout(); // Logout on unauthorized
        throw new Error("Nicht autorisiert. Sie wurden ausgeloggt.");
      }

      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(`Fehler beim Abrufen der Item-Listen-Daten: ${errorMessage}`);
      }

      const itemList: ItemList[] = await res.json();

      // Group item lists by date
      const groupedItems: { [key: string]: number } = {};

      for (let i = 0; i < itemList.length; i++) {
        const item = itemList[i];
        const date = item.entered_on.split('T')[0]; // Extract date part (yyyy-mm-dd)
        if (groupedItems[date]) {
          groupedItems[date]++;
        } else {
          groupedItems[date] = 1;
        }
      }

      // Convert grouped data to array of DateCount
      const result: DateCount[] = Object.keys(groupedItems).map(date => ({
        date,
        count: groupedItems[date],
      }));

      return result;
    } catch (err: any) {
      throw new Error(err.message || "Unbekannter Fehler beim Abrufen der Item-Listen-Daten.");
    }
  }

  // Count items per day for the current user
  async fetchItemDataCounting(): Promise<DateCount[]> {
    const token = userService.getToken();
    const userID = userService.getUserID();
    if (!token || !userID) throw new Error("Nicht eingeloggt.");

    const headers = { Authorization: `Bearer ${token}` };
    try {

      const url = new URL(`${this.baseUrl}/items`);
      url.searchParams.append("user_id", userID.toString());

      const res = await fetch(url.toString(), {
        method: "GET",
        headers,
      });

      if (res.status === 401) {
        userService.logout(); // Logout on unauthorized
        throw new Error("Nicht autorisiert. Sie wurden ausgeloggt.");
      }

      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(`Fehler beim Abrufen der Item-Daten: ${errorMessage}`);
      }

      const itemList: Item[] = await res.json();

      if (!itemList) return [];

      // Group items by date
      const groupedItems: { [key: string]: number } = {};

      itemList.forEach(item => {
        const date = item.entered_on.split('T')[0]; // Extract date part (yyyy-mm-dd)
        if (groupedItems[date]) {
          groupedItems[date]++;
        } else {
          groupedItems[date] = 1;
        }
      });

      // Convert grouped data to array of DateCount
      const result: DateCount[] = Object.keys(groupedItems).map(date => ({
        date,
        count: groupedItems[date],
      }));

      return result;
    } catch (err: any) {
      throw new Error(err.message || "Unbekannter Fehler beim Abrufen der Item-Daten.");
    }
  }
}

// Export a singleton instance of the service
export const itemService = new ItemService();