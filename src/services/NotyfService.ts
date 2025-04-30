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

// Exportierte Methoden
const NotyfService = {
  showError(message: string, duration = 5000) {
    notyf.error({ message, duration });
  },
  showSuccess(message: string, duration = 5000) {
    notyf.success({ message, duration });
  }
};

export default NotyfService;
