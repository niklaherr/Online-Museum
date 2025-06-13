// Interface representing the structure of a contact form entry
export default interface ContactForm {
  id: number; // Unique identifier for the contact form entry
  name: string; // Name of the person submitting the form
  email: string; // Email address of the submitter
  subject: string; // Subject of the message
  message: string; // Content of the message
  submitted_on: string; // Submission date as an ISO string
  status: 'new' | 'in_progress' | 'completed'; // Current processing status
}