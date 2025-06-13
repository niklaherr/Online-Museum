import { useState } from 'react';
import { Credentials, userService } from 'services/UserService';
import NotyfService from 'services/NotyfService';

// Props for RegisterPage, expects a navigation callback
type RegisterPageProps = {
  onNavigate: (route: string) => void;
};

// Security questions options for the dropdown
const securityQuestions = [
  "Familienname der Mutter",
  "Name des ersten Haustieres",
  "Name bester Freund in der Grundschule"
];

const RegisterPage = ({ onNavigate }: RegisterPageProps) => {
  // State variables for form fields and UI state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState(securityQuestions[0]);
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Handles form submission and validation
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError('');
    
    // Basic validation for required fields
    if (!username || !password || !securityQuestion || !securityAnswer) {
      setError('Bitte füllen Sie alle Pflichtfelder aus');
      return;
    }

    // Password length validation
    if (password.length < 6) {
      setError('Das Passwort muss mindestens 6 Zeichen lang sein.');
      return;
    }
    
    // Password match validation
    if (password !== confirmPassword) {
      setError('Die Passwörter stimmen nicht überein');
      return;
    }

    // Security answer validation
    if (securityAnswer.trim() === '') {
      setError('Bitte geben Sie eine Antwort auf die Sicherheitsfrage ein');
      return;
    }
    
    setIsLoading(true);
    try {
      // Prepare credentials and call signup service
      const credentials: Credentials = {
        username: username,
        password: password,
        securityQuestion: securityQuestion,  
        securityAnswer: securityAnswer
      };
      
      await userService.signup(credentials);
      NotyfService.showSuccess('Registrierung erfolgreich!');
      onNavigate('/dashboard');
    } catch (err) {
      setError('Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.');
      NotyfService.showError('Registrierung fehlgeschlagen');
    } finally {
      setIsLoading(false);
    }
  };

  // Render registration form UI
  return (
    <div className="flex items-center justify-center min-h-full p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Registrieren</h1>
          <p className="mt-2 text-gray-600">
            Erstellen Sie Ihr Online-Museum Konto
          </p>
        </div>

        {/* Error message display */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Registration form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Username input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Benutzername <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ihr Benutzername"
              required
            />
          </div>

          {/* Password input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Passwort <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Confirm password input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Passwort bestätigen <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Security question dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sicherheitsfrage <span className="text-red-500">*</span>
            </label>
            <select
              value={securityQuestion}
              onChange={(e) => setSecurityQuestion(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {securityQuestions.map((question, index) => (
                <option key={index} value={question}>
                  {question}
                </option>
              ))}
            </select>
          </div>

          {/* Security answer input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Antwort auf Sicherheitsfrage <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ihre Antwort"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Diese Frage wird verwendet, um Ihr Passwort zurückzusetzen, falls Sie es vergessen.
            </p>
          </div>

          {/* Submit button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isLoading ? 'Registrierung läuft...' : 'Registrieren'}
            </button>
          </div>
        </form>

        {/* Link to login page */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Bereits ein Konto?{' '}
            <button
              type="button"
              onClick={() => onNavigate('/login')}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Anmelden
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;