import NotyfService from "./NotyfService";

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

class ContactFormService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:3001";
  }

  async submitContactForm(formData: ContactFormData): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/contact-form`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Fehler beim Senden des Formulars");
      }

      return true;
    } catch (error) {
      if (error instanceof Error) {
        NotyfService.showError(error.message);
      } else {
        NotyfService.showError("Ein unbekannter Fehler ist aufgetreten");
      }
      return false;
    }
  }
}

export const contactFormService = new ContactFormService();