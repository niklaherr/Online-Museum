// Defines the structure of an item in the museum
export default interface Item {
  id: number;
  user_id: number;
  title: string;
  entered_on: string; 
  image: string;
  description: string;
  category: string;
  isprivate: boolean;
};  

// Extends Item with a username for gallery display
export interface GalleryItem extends Item {
  username: string;
}