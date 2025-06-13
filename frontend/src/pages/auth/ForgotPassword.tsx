import { useState } from 'react';
import NotyfService from 'services/NotyfService';

type ForgotPasswordProps = {
  onNavigate: (route: string) => void;
};

const ForgotPassword = ({ onNavigate }: ForgotPasswordProps) => {
  // State variables for each step and form fields
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userSecurityQuestion, setUserSecurityQuestion] = useState('');
  const [resetToken, setResetToken] = useState('');

  // Step 1: Fetch the user's security question by username
  const findUser = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!username) {
      setError('Bitte geben Sie Ihren Benutzernamen ein');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL || 'http://localhost:3001'}/security-question/${username}`);
      if (!response.ok) {
        throw new Error('Benutzername nicht gefunden');
      }
      const data = await response.json();
      setUserSecurityQuestion(data.securityQuestion);
      setStep(2);
      setError('');
    } catch (err) {
      setError('Benutzername nicht gefunden');
      NotyfService.showError('Benutzername nicht gefunden');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify the answer to the security question
  const verifySecurityQuestion = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!securityAnswer) {
      setError('Bitte beantworten Sie die Sicherheitsfrage');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL || 'http://localhost:3001'}/verify-security-question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, securityAnswer }),
      });
      if (!response.ok) {
        throw new Error('Die Antwort auf die Sicherheitsfrage ist falsch');
      }
      const data = await response.json();
      setResetToken(data.resetToken);
      setStep(3);
      setError('');
    } catch (err) {
      setError('Die Antwort auf die Sicherheitsfrage ist falsch');
      NotyfService.showError('Falsche Antwort auf die Sicherheitsfrage');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset the user's password
  const resetPassword = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setError('Bitte füllen Sie alle Felder aus');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Die Passwörter stimmen nicht überein');
      return;
    }
    if (newPassword.length < 6) {
      setError('Das Passwort muss mindestens 6 Zeichen lang sein');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL || 'http://localhost:3001'}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resetToken, newPassword }),
      });
      if (!response.ok) {
        throw new Error('Fehler beim Zurücksetzen des Passworts');
      }
      NotyfService.showSuccess('Ihr Passwort wurde erfolgreich zurückgesetzt');
      onNavigate('/login');
    } catch (err) {
      setError('Fehler beim Zurücksetzen des Passworts');
      NotyfService.showError('Passwort-Reset fehlgeschlagen');
    } finally {
      setIsLoading(false);
    }
  };

  // Render the UI for each step of the password reset process
  return (
    <div className="flex items-center justify-center min-h-full p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Passwort zurücksetzen</h1>
          <p className="mt-2 text-gray-600">
            {step === 1 && 'Geben Sie Ihren Benutzernamen ein'}
            {step === 2 && 'Beantworten Sie Ihre Sicherheitsfrage'}
            {step === 3 && 'Setzen Sie ein neues Passwort'}
          </p>
        </div>

        {/* Display error message if present */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Step 1: Username input form */}
        {step === 1 && (
          <form className="space-y-6" onSubmit={findUser}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Benutzername
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
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isLoading ? 'Wird verarbeitet...' : 'Weiter'}
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Security question form */}
        {step === 2 && (
          <form className="space-y-6" onSubmit={verifySecurityQuestion}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Sicherheitsfrage
              </label>
              <div className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                {userSecurityQuestion}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Antwort
              </label>
              <input
                type="text"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ihre Antwort"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isLoading ? 'Wird verarbeitet...' : 'Weiter'}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: New password form */}
        {step === 3 && (
          <form className="space-y-6" onSubmit={resetPassword}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Neues Passwort
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Neues Passwort"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Passwort bestätigen
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Passwort bestätigen"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isLoading ? 'Wird verarbeitet...' : 'Passwort zurücksetzen'}
              </button>
            </div>
          </form>
        )}

        {/* Link to navigate back to login */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Zurück zur{' '}
            <button
              type="button"
              onClick={() => onNavigate('/login')}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Anmeldung
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;