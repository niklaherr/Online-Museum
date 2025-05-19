import User from "interfaces/User";
import NotyfService from "./NotyfService";

export type AuthResponse = {
    id: number;
    username: string;
    token: string;
    isAdmin: boolean;
};

class AdminService {
    private baseUrl: string;
    
    constructor() {
        this.baseUrl = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:3001";
    }
    
    async addAdmin(userId: number): Promise<boolean> {
        // Simulate API call
        console.log(`Adding admin privileges to user with ID: ${userId}`);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Simulate success
        NotyfService.showSuccess("Benutzer wurde erfolgreich zum Administrator ernannt");
        return true;
    }
    
    async deleteAdmin(userId: number): Promise<boolean> {
        // Simulate API call
        console.log(`Removing admin privileges from user with ID: ${userId}`);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Simulate success
        NotyfService.showSuccess("Administrator-Status wurde erfolgreich entfernt");
        return true;
    }
    
    async searchUsers(query: string): Promise<User[]> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 700));
        
        // Create dummy data
        const dummyUsers: User[] = [
            {
                id: 1,
                username: "johndoe",
                token: "dummy-token-1",
                isAdmin: false
            },
            {
                id: 2,
                username: "janedoe",
                token: "dummy-token-2",
                isAdmin: false
            },
            {
                id: 3,
                username: "bobsmith",
                token: "dummy-token-3",
                isAdmin: false
            },
            {
                id: 4,
                username: "alicejones",
                token: "dummy-token-4",
                isAdmin: false
            },
            {
                id: 5,
                username: "mikebrown",
                token: "dummy-token-5",
                isAdmin: false
            }
        ];
        
        // Filter by query
        if (!query) return [];
        
        const filteredUsers = dummyUsers.filter(user => 
            user.username.toLowerCase().includes(query.toLowerCase())
        );
        
        console.log(`Searched for users with query "${query}", found ${filteredUsers.length} results`);
        return filteredUsers;
    }
    
    async getAdmins(): Promise<User[]> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Create dummy admin data
        const dummyAdmins: User[] = [
            {
                id: 6,
                username: "admin1",
                token: "admin-token-1",
                isAdmin: true
            },
            {
                id: 7,
                username: "admin2",
                token: "admin-token-2",
                isAdmin: true
            },
            {
                id: 8,
                username: "superadmin",
                token: "admin-token-3",
                isAdmin: true
            }
        ];
        
        console.log(`Retrieved ${dummyAdmins.length} administrators`);
        return dummyAdmins;
    }
}

export const adminService = new AdminService()