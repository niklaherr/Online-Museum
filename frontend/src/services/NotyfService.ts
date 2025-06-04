// notyfService.js
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

// Konfiguriere eine einzige Notyf-Instanz
const notyf = new Notyf({
  duration: 5000,
  dismissible: true,
  position: {
    x: 'center',
    y: 'top'
  }
});

class NotyfService {
  private lastMessage: string;
  private lastCall: number;

  constructor() {
    this.lastMessage = "";
    this.lastCall = 0;
  }

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

  showError(message: string, duration = 5000) {
    if (this.shouldShow(message)) {
      notyf.error({ message, duration });
    }
  }

  showSuccess(message: string, duration = 5000) {
    if (this.shouldShow(message)) {
      notyf.success({ message, duration });
    }
  }
}

export default new NotyfService();


export const notyfService = new NotyfService();
