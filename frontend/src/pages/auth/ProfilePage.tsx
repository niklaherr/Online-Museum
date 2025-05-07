import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import {
  Card, Title, Text, Flex, Button, TextInput,
} from '@tremor/react';
import {
  PencilSquareIcon,
  KeyIcon,
  ShieldCheckIcon,
  TrashIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { ResetPasswordWithOldPasswordCredentials, userService } from 'services/UserService';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ResetPasswordWithOldPasswordCredentials>({
    oldPassword: '',
    newPassword: '',
    reNewPassword: '',
  });

  const handleInputChange = (e: { target: { name: string; value: string; }; }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    console.log("true")
    await userService.resetPasswordWithOldPassword(formData);
    setIsEditing(false);
  };

  const logout = () => {
    userService.logout();
  };

  if (!userService.isLoggedIn()) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <ArrowRightOnRectangleIcon className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-medium text-gray-900">Nicht angemeldet</h2>
        <p className="mt-2 text-gray-600">Bitte melden Sie sich an, um Ihr Profil anzuzeigen.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Title>Mein Profil</Title>
        <Text>Persönliche Informationen und Kontoeinstellungen</Text>
      </div>

      <Card className="space-y-6">
        {isEditing ? (
          <div className="space-y-4">
            <Title>Passwort zurücksetzen</Title>

            <div>
              <Text className="mb-1">Altes Passwort</Text>
              <TextInput
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleInputChange}
                placeholder="Altes Passwort"
                type="password"
              />
            </div>

            <div>
              <Text className="mb-1">Neues Passwort</Text>
              <TextInput
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Neues Passwort"
                type="password"
              />
            </div>

            <div>
              <Text className="mb-1">Neues Passwort wiederholen</Text>
              <TextInput
                name="reNewPassword"
                value={formData.reNewPassword}
                onChange={handleInputChange}
                placeholder="Neues Passwort wiederholen"
                type="password"
              />
            </div>

            <Flex justifyContent="end" className="pt-4 space-x-2">
              <Button variant="secondary" color="gray" onClick={() => setIsEditing(false)}>
                Abbrechen
              </Button>
              <Button color="blue" onClick={handleSubmit}>
                Speichern
              </Button>
            </Flex>
          </div>
        ) : (
          <div>
            <div className="mb-6 text-center">
              <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-semibold text-gray-500">
                  {userService.getUserName()?.charAt(0).toUpperCase()}
                </span>
              </div>
              <Title>{userService.getUserName() ?? "Empty"}</Title>
            </div>

            <div className="mt-6 space-y-3">

              <Button
                variant="light"
                color="blue"
                icon={KeyIcon}
                className="w-full justify-start"
                onClick={() => setIsEditing(true)}
              >
                Passwort ändern
              </Button>

              <Button
                variant="light"
                color="purple"
                icon={ShieldCheckIcon}
                className="w-full justify-start"
              >
                Datenschutzeinstellungen
              </Button>

              <Button
                variant="light"
                color="red"
                icon={TrashIcon}
                className="w-full justify-start"
              >
                Konto löschen
              </Button>

              <Button
                variant="light"
                color="red"
                icon={ArrowRightOnRectangleIcon}
                className="w-full justify-start"
                onClick={logout}
              >
                Abmelden
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProfilePage;
