import User from "interfaces/User";
import NotyfService from "./NotyfService";

// Response type for authentication endpoints
export type AuthResponse = {
    id: number;
    username: string;
    token: string;
    isadmin: boolean;
};

// Credentials required for login/signup
export type Credentials = {
    username: string;
    password: string;
    securityQuestion?: string;
    securityAnswer?: string;
};

// Credentials for resetting password with old password
export type ResetPasswordWithOldPasswordCredentials = {
    oldPassword: string;
    newPassword: string;
    reNewPassword: string;
}

// Listener type for user state changes
type UserChangeListener = (user: User | null) => void;

class UserService {
    private maxRetries: number;
    private baseUrl: string;
    private currentUser: User | null;
    private listeners: UserChangeListener[] = [];

    // Initialize service with optional maxRetries and baseUrl
    constructor(maxRetries: number = 3) {
        this.maxRetries = maxRetries;
        this.baseUrl = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:3001";
        this.currentUser = null;
    }

    // Log in user and notify listeners
    async login(credentials: Credentials): Promise<AuthResponse | undefined> {
        try {
            const response = await fetch(`${this.baseUrl}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.error || `HTTP Error: ${response.status}`);
            }

            const res: AuthResponse = await response.json();
            this.currentUser = res;
            this.notifyListeners();
            return res;
        } catch (error) {
            NotyfService.showError("Fehler beim Anmelden");
            return undefined;
        }
    }

    // Register new user and notify listeners
    async signup(credentials: Credentials): Promise<AuthResponse> {
        const response = await fetch(`${this.baseUrl}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: credentials.username,
                password: credentials.password,
                securityQuestion: credentials.securityQuestion,
                securityAnswer: credentials.securityAnswer
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.error || `HTTP Error: ${response.status}`);
        }

        const res: AuthResponse = await response.json();
        this.currentUser = res;
        this.notifyListeners();
        return res;
    }

    // Reset password using the old password
    async resetPasswordWithOldPassword(credentials: ResetPasswordWithOldPasswordCredentials): Promise<Boolean> {
        const response = await fetch(`${this.baseUrl}/reset-password-with-old-password`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.getToken()}`
            },
            body: JSON.stringify(credentials),
        });

        if (response.status === 401) {
            this.logout();
            throw new Error("Nicht autorisiert. Sie wurden ausgeloggt.");
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Fehler beim Zurücksetzen des Passworts");
        }
        return true;
    }

    // Delete current user account
    async deleteUser(): Promise<boolean> {
        const response = await fetch(`${this.baseUrl}/users`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.getToken()}`
            }
        });

        if (response.status === 401) {
            this.logout();
            throw new Error("Nicht autorisiert. Sie wurden ausgeloggt.");
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Fehler beim Löschen des Benutzers");
        }

        this.logout();
        return true;
    }

    // Log out user and notify listeners
    logout(): void {
        this.currentUser = null;
        this.notifyListeners();
    }

    // Get current user's token
    getToken(): string | undefined {
        return this.currentUser?.token;
    }

    // Get current user's ID
    getUserID(): number | undefined {
        return this.currentUser?.id;
    }

    // Check if user is logged in
    isLoggedIn(): boolean {
        return this.currentUser != null;
    }

    // Get current user's username
    getUserName(): string | undefined {
        return this.currentUser?.username;
    }

    // Check if current user is admin
    isadmin(): boolean | undefined {
        return this.currentUser?.isadmin;
    }

    // Set current user manually
    setCurrentUser(user: User) {
        this.currentUser = user;
    }

    // Subscribe to user state changes
    subscribe(listener: UserChangeListener): void {
        this.listeners.push(listener);
    }

    // Unsubscribe from user state changes
    unsubscribe(listener: UserChangeListener): void {
        this.listeners = this.listeners.filter((l) => l !== listener);
    }

    // Notify all listeners about user state change
    private notifyListeners(): void {
        this.listeners.forEach((listener) => listener(this.currentUser));
    }
}

// Export a singleton instance of UserService
export const userService = new UserService();