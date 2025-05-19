import User from "interfaces/User";
import NotyfService from "./NotyfService";
import { userService } from "./UserService";

class AdminService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:3001";
    }

    async addAdmin(userId: number): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/admin/${userId}`, {
                method: "PUT",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userService.getToken()}`
                },
                body: JSON.stringify({ isAdmin: true }),
            });

            if (!response.ok) throw new Error("Failed to assign admin");
            return true;
        } catch (error) {
            console.error("addAdmin error:", error);
            throw new Error("Problem beim Hinzufügen des Admins");
        }
    }

    async deleteAdmin(userId: number): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/admin/${userId}`, {
                method: "PUT",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userService.getToken()}`
                },
                body: JSON.stringify({ isAdmin: false }),
            });

            if (!response.ok) throw new Error("Failed to remove admin");
            return true;
        } catch (error) {
            console.error("deleteAdmin error:", error);
            NotyfService.showError("Fehler beim Entfernen des Admins");
            return false;
        }
    }

    async searchUsers(query: string): Promise<User[]> {
        try {
            const response = await fetch(`${this.baseUrl}/admin/search?q=${encodeURIComponent(query)}`, {
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userService.getToken()}`
                },
            });

            if (!response.ok) throw new Error("Search failed");

            const users: User[] = await response.json();
            return users;
        } catch (error) {
            console.error("searchUsers error:", error);
            NotyfService.showError("Fehler bei der Benutzersuche");
            return [];
        }
    }

    async getAdmins(): Promise<User[]> {
        try {
            const response = await fetch(`${this.baseUrl}/admin`, {
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userService.getToken()}`
                },
            });

            if (!response.ok) throw new Error("Failed to fetch admins");

            const admins: User[] = await response.json();
            return admins;
        } catch (error) {
            console.error("getAdmins error:", error);
            NotyfService.showError("Fehler beim Abrufen der Administratoren");
            return [];
        }
    }
}

export const adminService = new AdminService();
