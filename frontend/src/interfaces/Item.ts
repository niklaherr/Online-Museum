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

export interface GalleryItem extends Item {
  username: string;
}