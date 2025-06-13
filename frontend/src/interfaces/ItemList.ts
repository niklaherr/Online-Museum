// Interface representing the structure of an item in the item list
export default interface ItemList {
  id: number; // Unique identifier for the item
  title: string; // Title of the item
  description: string; // Description of the item
  entered_on: string; // Date when the item was entered
  user_id: number; // ID of the user who added the item
  isprivate: boolean; // Indicates if the item is private
  main_image?: string; // Optional main image URL for the item
}