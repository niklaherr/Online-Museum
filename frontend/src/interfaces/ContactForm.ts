export default interface ContactForm {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  submitted_on: string;
  status: 'new' | 'in_progress' | 'completed';
}