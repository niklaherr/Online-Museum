import { useState } from 'react';
import { Card, Title, Text, Flex, Button, TextInput, Dialog, DialogPanel, Badge } from '@tremor/react';
import { KeyIcon, ShieldCheckIcon, TrashIcon, ArrowRightOnRectangleIcon, UserIcon, CogIcon, ExclamationTriangleIcon, ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import { ResetPasswordWithOldPasswordCredentials, userService } from 'services/UserService';
import NotyfService from 'services/NotyfService';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  // State for edit mode, delete modal, loading, and password form
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ResetPasswordWithOldPasswordCredentials>({
    oldPassword: '',
    newPassword: '',
    reNewPassword: '',
  });

  // Handle input changes for password form
  const handleInputChange = (e: { target: { name: string; value: string; }; }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle password change form submission
  const handleSubmit = async () => {
    if (!formData.oldPassword || !formData.newPassword || !formData.reNewPassword) {
      NotyfService.showError("Bitte füllen Sie alle Felder aus.");
      return;
    }

    if (formData.newPassword !== formData.reNewPassword) {
      NotyfService.showError("Die neuen Passwörter stimmen nicht überein.");
      return;
    }

    if (formData.newPassword.length < 6) {
      NotyfService.showError("Das Passwort muss mindestens 6 Zeichen lang sein.");
      return;
    }

    setIsLoading(true);
    try {
      await userService.resetPasswordWithOldPassword(formData);
      setIsEditing(false);
      setFormData({
        oldPassword: '',
        newPassword: '',
        reNewPassword: '',
      });
      NotyfService.showSuccess("Passwort erfolgreich geändert.")
    } catch (error) {
      let errorMessage = "Fehler beim Zurücksetzen"
      if (error instanceof Error) {
        errorMessage = error.message
      }
      NotyfService.showError(errorMessage)
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user account deletion
  const deleteUser = async () => {
    setIsLoading(true);
    try {
      await userService.deleteUser();
      NotyfService.showSuccess("Nutzer erfolgreich gelöscht");
      navigate("/login");
    } catch (error) {
      let errorMessage = "Fehler beim Löschen des Benutzers"
      if (error instanceof Error) {
        errorMessage = error.message
      }
      NotyfService.showError(errorMessage)
    } finally {
      setIsLoading(false);
    }
  };

  // Show login prompt if user is not logged in
  if (!userService.isLoggedIn()) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="max-w-md w-full">
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <ArrowRightOnRectangleIcon className="w-8 h-8 text-red-500" />
            </div>
            <Title className="text-xl text-gray-900 mb-2">Nicht angemeldet</Title>
            <Text className="text-gray-600">Bitte melden Sie sich an, um Ihr Profil anzuzeigen.</Text>
            <Button className="mt-4" onClick={() => navigate('/login')}>
              Zur Anmeldung
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Get user info for display
  const userName = userService.getUserName();
  const isadmin = userService.isadmin();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero header with user avatar and welcome message */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-10">
        </div>
        <div className="relative p-8 text-white">
          <div className="flex items-center space-x-6">
            {/* User avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl border-4 border-white/30">
                <span className="text-4xl font-bold text-white">
                  {userName?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            {/* User info and greeting */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <Title className="text-3xl font-bold text-white">{userName}</Title>
              </div>
              <Text className="text-blue-100 text-lg">
                Willkommen in Ihrem persönlichen Bereich
              </Text>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main content: password form or account overview */}
        <div className="lg:col-span-4 space-y-6">
          {isEditing ? (
            // Password change form
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <KeyIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <Title className="text-xl">Passwort ändern</Title>
                  <Text className="text-gray-600">Aktualisieren Sie Ihr Passwort für mehr Sicherheit</Text>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <Text className="font-medium mb-2 text-gray-700">Aktuelles Passwort *</Text>
                  <TextInput
                    name="oldPassword"
                    value={formData.oldPassword}
                    onChange={handleInputChange}
                    placeholder="Geben Sie Ihr aktuelles Passwort ein"
                    type="password"
                    className="w-full"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Text className="font-medium mb-2 text-gray-700">Neues Passwort *</Text>
                    <TextInput
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      placeholder="Mindestens 6 Zeichen"
                      type="password"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Text className="font-medium mb-2 text-gray-700">Passwort bestätigen *</Text>
                    <TextInput
                      name="reNewPassword"
                      value={formData.reNewPassword}
                      onChange={handleInputChange}
                      placeholder="Passwort wiederholen"
                      type="password"
                      className="w-full"
                    />
                  </div>
                </div>
                {/* Password security info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <ShieldCheckIcon className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <Text className="font-medium text-blue-800">Sicherheitshinweis</Text>
                      <Text className="text-sm text-blue-700 mt-1">
                        Verwenden Sie ein starkes Passwort mit mindestens 6 Zeichen. 
                        Kombinieren Sie Buchstaben, Zahlen und Sonderzeichen für maximale Sicherheit.
                      </Text>
                    </div>
                  </div>
                </div>
                <Flex justifyContent="end" className="pt-4 space-x-3">
                  <Button 
                    variant="secondary" 
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        oldPassword: '',
                        newPassword: '',
                        reNewPassword: '',
                      });
                    }}
                    disabled={isLoading}
                  >
                    Abbrechen
                  </Button>
                  <Button 
                    color="blue" 
                    onClick={handleSubmit}
                    loading={isLoading}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0"
                  >
                    Passwort speichern
                  </Button>
                </Flex>
              </div>
            </Card>
          ) : (
            // Account overview
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <UserIcon className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <Title className="text-xl">Kontoinformationen</Title>
                  <Text className="text-gray-600">Verwalten Sie Ihre Accountdaten</Text>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Text className="text-sm font-medium text-gray-500 mb-1">Benutzername</Text>
                      <Text className="font-semibold text-gray-900">{userName}</Text>
                    </div>
                    <div>
                      <Text className="text-sm font-medium text-gray-500 mb-1">Rolle</Text>
                      <div className="flex items-center">
                        {isadmin ? (
                          <Badge color="red" icon={ShieldCheckIcon} size="sm">
                            Administrator
                          </Badge>
                        ) : (
                          <Badge color="blue" icon={UserIcon} size="sm">
                            Benutzer
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
        {/* Actions card: change password and logout */}
        <Card className="lg:col-span-2 p-6">
            <Title className="text-lg mb-4 flex items-center">
              <CogIcon className="w-5 h-5 mr-2 text-gray-600" />
              Aktionen
            </Title>
            <div className="space-y-3">
              <Button
                variant="secondary"
                color="blue"
                icon={KeyIcon}
                className="w-full justify-start bg-blue-50 hover:bg-blue-100 text-blue-700 mb-4"
                onClick={() => setIsEditing(true)}
                disabled={isEditing}
              >
                Passwort ändern
              </Button>
              <Button
                variant="secondary"
                color="red"
                icon={ArrowRightCircleIcon}
                className="w-full justify-start bg-red-50 hover:bg-red-100 text-red-700"
                onClick={() => userService.logout()}
              >
                Abmelden
              </Button>
            </div>
          </Card>
        {/* Danger zone card: delete account */}
        <Card className="lg:col-span-2 w-full p-6">
            <Title className="text-lg mb-4 flex items-center text-red-700">
              <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
              Gefahrenbereich
            </Title>
            <div className="space-y-4">
              <Text className="text-gray-600 text-sm">
                Das Löschen Ihres Kontos ist permanent und kann nicht rückgängig gemacht werden.
              </Text>
              <Button
                variant="secondary"
                color="red"
                icon={TrashIcon}
                className="w-full justify-start bg-red-50 hover:bg-red-100 text-red-700"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                Konto löschen
              </Button>
            </div>
          </Card>
      </div>
      {/* Delete confirmation modal */}
      <Dialog open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <DialogPanel className="max-w-md bg-white rounded-xl shadow-xl p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <TrashIcon className="h-6 w-6 text-red-600" />
            </div>
            <Title className="text-lg font-semibold text-gray-900 mb-2">
              Konto wirklich löschen?
            </Title>
            <Text className="text-gray-500 mb-6">
              Diese Aktion kann nicht rückgängig gemacht werden. Alle Ihre Daten, 
              Items und Listen werden permanent gelöscht.
            </Text>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
              <Text className="text-red-800 text-sm font-medium">
                ⚠️ Warnung: Diese Aktion ist unwiderruflich!
              </Text>
            </div>
            <Flex justifyContent="end" className="space-x-3">
              <Button 
                variant="secondary" 
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isLoading}
              >
                Abbrechen
              </Button>
              <Button 
                color="red" 
                onClick={() => { 
                  deleteUser(); 
                  setIsDeleteModalOpen(false); 
                }}
                loading={isLoading}
                disabled={isLoading}
              >
                Ja, löschen
              </Button>
            </Flex>
          </div>
        </DialogPanel>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
