// Interface representing an activity record in the system
export default interface Activity {
    id: number; // Unique identifier for the activity
    category: string; // Category of the activity
    entered_on: string; // Timestamp when the activity was entered
    type: string; // Type of the activity
    element_id: number; // Related element's ID
    user_id: number; // ID of the user who performed the activity
};