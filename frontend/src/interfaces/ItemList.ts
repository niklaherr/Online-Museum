export default interface ItemList {
  id: number;
  title: string;
  description: string;
  entered_on: string;
  user_id: number;
  isprivate: boolean;
  main_image?: string;
}