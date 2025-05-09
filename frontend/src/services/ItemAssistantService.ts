// frontend/src/services/ItemAssistantService.ts

import NotyfService from "./NotyfService";

class ItemAssistantService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:3001";
  }

  // Generiert eine Beschreibung basierend auf Titel und Kategorie
  async generateDescription(title: string, category: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/item-assistant/generate-description`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, category }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Fehler bei der Beschreibungsgenerierung');
      }

      const data = await response.json();
      return data.description;
    } catch (error) {
      console.error('Fehler bei der Beschreibungsgenerierung:', error);
      if (error instanceof Error) {
        NotyfService.showError(error.message);
      } else {
        NotyfService.showError('Fehler bei der Beschreibungsgenerierung');
      }
      throw error;
    }
  }
}

export const itemAssistantService = new ItemAssistantService();