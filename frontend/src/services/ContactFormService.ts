import NotyfService from "./NotyfService";
import { userService } from "./UserService";
import ContactForm from "../interfaces/ContactForm";

// Interface for the contact form data sent by the user
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

class ContactFormService {
  private baseUrl: string;

  // Set the base URL for API requests
  constructor() {
    this.baseUrl = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:3001";
  }

  // Submit a contact form to the backend
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
      // Show error notification if submission fails
      if (error instanceof Error) {
        NotyfService.showError(error.message);
      } else {
        NotyfService.showError("Ein unbekannter Fehler ist aufgetreten");
      }
      return false;
    }
  }
  
  // Fetch all contact forms (admin only)
  async fetchContactForms(): Promise<ContactForm[]> {
    const token = userService.getToken();
    if (!token) throw new Error("Nicht eingeloggt.");
    
    if (!userService.isadmin()) {
      throw new Error("Keine Administratorrechte.");
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/contact-form`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Handle unauthorized or forbidden responses
      if (response.status === 401) {
        userService.logout();
        throw new Error("Nicht autorisiert. Sie wurden ausgeloggt.");
      }
      
      if (response.status === 403) {
        throw new Error("Keine Zugriffsberechtigung für diese Ressource.");
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Fehler beim Laden der Kontaktanfragen");
      }
      
      return await response.json();
    } catch (error) {
      // Propagate error to caller
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Ein unbekannter Fehler ist aufgetreten");
      }
    }
  }
  
  // Update the status of a contact form (admin only)
  async updateContactFormStatus(id: number, status: 'new' | 'in_progress' | 'completed'): Promise<ContactForm> {
    const token = userService.getToken();
    if (!token) throw new Error("Nicht eingeloggt.");
    
    if (!userService.isadmin()) {
      throw new Error("Keine Administratorrechte.");
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/contact-form/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      
      // Handle unauthorized or forbidden responses
      if (response.status === 401) {
        userService.logout();
        throw new Error("Nicht autorisiert. Sie wurden ausgeloggt.");
      }
      
      if (response.status === 403) {
        throw new Error("Keine Zugriffsberechtigung für diese Ressource.");
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Fehler beim Aktualisieren des Status");
      }
      
      return await response.json();
    } catch (error) {
      // Propagate error to caller
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Ein unbekannter Fehler ist aufgetreten");
      }
    }
  }
}

// Export a singleton instance of the service
export const contactFormService = new ContactFormService();