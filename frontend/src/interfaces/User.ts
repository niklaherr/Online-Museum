// Interface representing a user object with authentication and role information
export default interface User {
    id: number;           // Unique identifier for the user
    username: string;     // Username of the user
    token: string;        // Authentication token
    isadmin: boolean;     // Indicates if the user has admin privileges
}