import User from "interfaces/User";
import NotyfService from "./NotyfService";

export type AuthResponse = {
    id: number;
    username: string;
    token: string;
    isAdmin: boolean;
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

    async signup(credentials: Credentials): Promise<AuthResponse> {
        const response = await fetch(`${this.baseUrl}/register`, {
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
    }

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

    async deleteUser(): Promise<boolean> {
        const response = await fetch(`${this.baseUrl}/users/me`, {
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

    isAdmin(): boolean | undefined {
        return this.currentUser?.isAdmin;
    }

    setCurrentUser(user: User) {
        this.currentUser = user;
    }

    subscribe(listener: UserChangeListener): void {
        this.listeners.push(listener);
    }

    unsubscribe(listener: UserChangeListener): void {
        this.listeners = this.listeners.filter((l) => l !== listener);
    }

    private notifyListeners(): void {
        this.listeners.forEach((listener) => listener(this.currentUser));
    }
}

export const userService = new UserService();