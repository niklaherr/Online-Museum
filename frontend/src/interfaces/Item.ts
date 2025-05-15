export default interface Item {
    id: number;
    user_id: number;
    title: string;
    entered_on: string; // ISO date string (e.g. "2025-04-30")
    image: string;
    description: string;
    category: string;
  };  

export interface GalleryItem extends Item {
  username: string;
}