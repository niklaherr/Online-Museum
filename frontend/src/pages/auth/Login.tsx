import { useState } from 'react';
import { Credentials, userService } from 'services/UserService';

type LoginPageProps = {
  onNavigate: (route: string) => void;
};

// Login page component for user authentication
const LoginPage = ({ onNavigate }: LoginPageProps) => {
  // State for form fields, loading, and error message
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Handles form submission and login logic
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Bitte Benutzername und Passwort eingeben');
      return;
    }
    
    setIsLoading(true);
    const credentials: Credentials = {
      username: username,
      password: password,
    };
    const user = await userService.login(credentials);

    setIsLoading(false);
    
    if (user) {
      onNavigate('/dashboard');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-full p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        {/* Header with title and subtitle */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Anmelden</h1>
          <p className="mt-2 text-gray-600">
            Willkommen zurück beim Online-Museum
          </p>
        </div>

        {/* Error message display */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Login form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Username input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Benutzername
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Benutzername"
            />
          </div>

          {/* Password input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Passwort
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          {/* Forgot password link */}
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <button 
                type="button"
                onClick={() => onNavigate('/forgot-password')}
                className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
              >
                Passwort vergessen?
              </button>
            </div>
          </div>

          {/* Submit button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isLoading ? 'Anmeldung läuft...' : 'Anmelden'}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Oder
              </span>
            </div>
          </div>
        </div>

        {/* Registration link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Noch kein Konto?{' '}
            <button
              onClick={() => onNavigate('/register')}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Jetzt registrieren
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;