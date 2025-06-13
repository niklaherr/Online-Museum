import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

// Create a single Notyf instance with custom configuration
const notyf = new Notyf({
  duration: 5000,
  dismissible: true,
  position: {
    x: 'center',
    y: 'top'
  }
});

// Service class to manage notification logic and prevent duplicates
class NotyfService {
  private lastMessage: string; // Stores the last shown message
  private lastCall: number;    // Timestamp of the last notification

  constructor() {
    this.lastMessage = "";
    this.lastCall = 0;
  }

  // Determines if a message should be shown (prevents duplicates within 5 seconds)
  private shouldShow(message: string): boolean {
    const now = Date.now();
    const isDuplicate = message === this.lastMessage;
    const timeSinceLast = now - this.lastCall;

    if (!isDuplicate || timeSinceLast > 5000) {
      this.lastMessage = message;
      this.lastCall = now;
      return true;
    }

    return false;
  }

  // Show an error notification if allowed by shouldShow
  showError(message: string, duration = 5000) {
    if (this.shouldShow(message)) {
      notyf.error({ message, duration });
    }
  }

  // Show a success notification if allowed by shouldShow
  showSuccess(message: string, duration = 5000) {
    if (this.shouldShow(message)) {
      notyf.success({ message, duration });
    }
  }
}

// Export a singleton instance for global use
const notyfServiceInstance = new NotyfService();
export default notyfServiceInstance;

// Export a new instance (alternative usage)
export const notyfService = new NotyfService();
