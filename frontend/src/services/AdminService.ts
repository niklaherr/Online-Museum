import User from "interfaces/User";
import NotyfService from "./NotyfService";
import { userService } from "./UserService";

// Service class for admin-related API calls
class AdminService {
    private baseUrl: string;

    constructor() {
        // Set base URL from environment or fallback to localhost
        this.baseUrl = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:3001";
    }

    // Assign admin rights to a user
    async addAdmin(userId: number): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/admin/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userService.getToken()}`
                },
                body: JSON.stringify({ isadmin: true }),
            });

            if (!response.ok) throw new Error("Admin konnte nicht hinzugefügt werden");
            return true;
        } catch (error) {
            throw new Error("Problem beim Hinzufügen des Admins");
        }
    }

    // Remove admin rights from a user
    async deleteAdmin(userId: number): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/admin/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userService.getToken()}`
                },
                body: JSON.stringify({ isadmin: false }),
            });

            if (!response.ok) throw new Error("Admin konnte nicht entfernt werden");
            return true;
        } catch (error) {
            NotyfService.showError("Fehler beim Entfernen des Admins");
            return false;
        }
    }

    // Search for users by query string
    async searchUsers(query: string): Promise<User[]> {
        try {
            const response = await fetch(`${this.baseUrl}/admin/search?q=${encodeURIComponent(query)}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userService.getToken()}`
                },
            });

            if (!response.ok) throw new Error("Suche fehlgeschlagen");

            const users: User[] = await response.json();
            return users;
        } catch (error) {
            NotyfService.showError("Fehler bei der Benutzersuche");
            return [];
        }
    }

    // Fetch all admin users
    async getAdmins(): Promise<User[]> {
        try {
            const response = await fetch(`${this.baseUrl}/admin`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userService.getToken()}`
                },
            });

            if (!response.ok) throw new Error("Administratoren konnten nicht abgerufen werden");

            const admins: User[] = await response.json();
            return admins;
        } catch (error) {
            console.error("getAdmins error:", error);
            NotyfService.showError("Fehler beim Abrufen der Administratoren");
            return [];
        }
    }
}

// Export a singleton instance of AdminService
export const adminService = new AdminService();
