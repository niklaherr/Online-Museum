import NotyfService from "./NotyfService";
import { userService } from "./UserService";

class ItemAssistantService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:3001";
  }

  // Generiert eine Beschreibung basierend auf Titel und Kategorie
  async generateDescription(title: string, category: string): Promise<string> {
    try {
      // Token für die Autorisierung holen (falls nötig)
      const token = userService.getToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      
      // Füge Authentifizierung hinzu, falls ein Token existiert
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseUrl}/api/item-assistant/generate-description`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ title, category }),
      });

      // Bessere Fehlerbehandlung
      const contentType = response.headers.get("content-type");
      
      if (!response.ok) {
        // Versuche den Fehler zu lesen, je nach Content-Type
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP-Fehler: ${response.status}`);
        } else {
          const text = await response.text();
          console.error("Server antwortete mit nicht-JSON:", text.substring(0, 200));
          throw new Error(`Server antwortete mit einem unerwarteten Format (${response.status})`);
        }
      }

      // Prüfe, ob tatsächlich JSON zurückgegeben wurde
      if (!contentType || contentType.indexOf("application/json") === -1) {
        const text = await response.text();
        console.error("Unerwarteter Content-Type:", contentType, "Antwort:", text.substring(0, 200));
        throw new Error("Server antwortete nicht mit JSON");
      }

      const data = await response.json();
      
      if (!data.description) {
        throw new Error("Die API-Antwort enthält keine Beschreibung");
      }
      
      return data.description;
    } catch (error) {
      console.error('Fehler bei der Beschreibungsgenerierung:', error);
      
      if (error instanceof Error) {
        NotyfService.showError(error.message);
      } else {
        NotyfService.showError('Ein unerwarteter Fehler ist aufgetreten');
      }
      
      throw error;
    }
  }
}

export const itemAssistantService = new ItemAssistantService();