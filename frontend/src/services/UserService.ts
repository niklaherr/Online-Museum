import User from "interfaces/User";
import NotyfService from "./NotyfService";

export type AuthResponse = {
    id: number;
    username: string;
    token: string;
};

export type Credentials = {
    username: string;
    password: string;
    securityQuestion?: string;
    securityAnswer?: string;
};

export type ResetPasswordWithOldPasswordCredentials = {
    oldPassword: string;
    newPassword: string;
    reNewPassword: string;
}

type UserChangeListener = (user: User | null) => void;

class UserService {
    private maxRetries: number;
    private baseUrl: string;
    private currentUser: User | null;
    private listeners: UserChangeListener[] = [];

    constructor(maxRetries: number = 3) {
        this.maxRetries = maxRetries;
        this.baseUrl = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:3001";
        this.currentUser = null;
    }

    async login(credentials: Credentials): Promise<AuthResponse | undefined> {
        try {
            const res = await this.postWithRetry<AuthResponse>("/login", credentials);
            this.currentUser = res;
            this.notifyListeners();
            return res
        } catch (error) {
            NotyfService.showError("Fehler beim Anmelden")
            return undefined;
        }
    }

    async signup(credentials: Credentials): Promise<AuthResponse> {
        const res = await this.postWithRetry<AuthResponse>("/register", credentials);
        this.currentUser = res;
        this.notifyListeners();
        return res;
    }

    async resetPasswordWithOldPassword(credentials: ResetPasswordWithOldPasswordCredentials): Promise<Boolean> {
        const response = await fetch(`${this.baseUrl}/reset-password-with-old-password`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.getToken()}` // Assumes you have a getToken() method
            },
            body: JSON.stringify(credentials),
        });
    
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Fehler beim Zurücksetzen des Passworts");
        }
        return true;
    }

    async deleteUser(): Promise<boolean> {
        const response = await fetch(`${this.baseUrl}/users/me`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.getToken()}` // Assumes getToken() provides the JWT
            }
        });
    
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Fehler beim Löschen des Benutzers");
        }

        this.logout();
    
        return true;
    }
    
    

    logout(): void {
        this.currentUser = null;
        this.notifyListeners();
    }

    getToken(): string | undefined {
        return this.currentUser?.token;
    }

    getUserID(): number | undefined {
        return this.currentUser?.id;
    }

    isLoggedIn(): boolean {
        return this.currentUser != null;
    }

    getUserName(): string | undefined {
        return this.currentUser?.username;
    }

    setCurrentUser(user: User) {
        this.currentUser = user;
    }


    /**
     * Subscribes a listener to user changes.
     */
    subscribe(listener: UserChangeListener): void {
        this.listeners.push(listener);
    }

    /**
     * Unsubscribes a listener.
     */
    unsubscribe(listener: UserChangeListener): void {
        this.listeners = this.listeners.filter((l) => l !== listener);
    }

    /**
     * Notify all listeners about the current user change.
     */
    private notifyListeners(): void {
        this.listeners.forEach((listener) => listener(this.currentUser));
    }

    private async postWithRetry<T>(endpoint: string, body: any): Promise<T> {
        let attempts = 0;
        while (attempts < this.maxRetries) {
            try {
                const response = await fetch(`${this.baseUrl}${endpoint}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => null);
                    throw new Error(errorData?.error || `HTTP Error: ${response.status}`);
                }

                if (response.status === 204) {
                    return {} as T;
                }

                return await response.json();
            } catch (error) {
                attempts += 1;
                console.warn(`Attempt ${attempts} failed: ${error}`);

                if (attempts >= this.maxRetries) {
                    throw new Error(`Failed after ${this.maxRetries} attempts: ${error}`);
                }
            }
        }
        throw new Error("Unexpected error: Retry logic failed.");
    }
}

export const userService = new UserService();
