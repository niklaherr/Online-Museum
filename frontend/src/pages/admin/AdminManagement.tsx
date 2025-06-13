import { useState, useEffect } from "react";
import { Card, Title, TextInput, Button, Grid, Text, Flex, Dialog, DialogPanel } from "@tremor/react";
import { MagnifyingGlassIcon, TrashIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import NotyfService from "services/NotyfService";
import Loading from "components/helper/Loading";
import User from "interfaces/User";
import { userService } from "services/UserService";
import { adminService } from "services/AdminService";

// Props type for navigation callback
type AdminManagementProps = {
  onNavigate?: (route: string) => void;
};

const AdminManagement = ({ onNavigate }: AdminManagementProps) => {
  // State for user search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // State for admin list and loading
  const [admins, setAdmins] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for remove admin confirmation dialog
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

  // Load admins on mount and check for admin permission
  useEffect(() => {
    if (!userService.isadmin()) {
      NotyfService.showError("Sie haben keine Berechtigung, diese Seite zu sehen");
      if (onNavigate) {
        onNavigate("/");
      }
      return;
    }

    const loadData = async () => {
      try {
        const adminsList = await adminService.getAdmins();
        setAdmins(adminsList);
        setIsLoading(false);
      } catch (error) {
        let errorMessage = "Fehler beim Laden der Administratoren";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        NotyfService.showError(errorMessage);
        if (onNavigate) {
          onNavigate("/");
        }
      }
    };

    loadData();
  }, [onNavigate]);

  // Search users by query
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await adminService.searchUsers(searchQuery);
      setSearchResults(results);
    } catch (error) {
      let errorMessage = "Fehler bei der Suche nach Benutzern";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      NotyfService.showError(errorMessage);
    } finally {
      setIsSearching(false);
    }
  };

  // Add user as admin and update state
  const addUserAsAdmin = async (user: User) => {
    try {
      await adminService.addAdmin(user.id);
      const updatedUser = { ...user, isadmin: true };
      setAdmins(prev => [...prev, updatedUser]);
      setSearchResults(prev => prev.filter(u => u.id !== user.id));
      NotyfService.showSuccess(`${user.username} wurde erfolgreich als Administrator hinzugefügt`);
    } catch (error) {
      let errorMessage = "Fehler beim Hinzufügen des Administrators";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      NotyfService.showError(errorMessage);
    }
  };

  // Open confirmation dialog for removing admin
  const confirmRemoveAdmin = (userId: number) => {
    setSelectedUserId(userId);
    setIsRemoveModalOpen(true);
  };

  // Remove admin and update state
  const handleRemoveAdmin = async () => {
    if (selectedUserId === null) return;

    try {
      await adminService.deleteAdmin(selectedUserId);
      setAdmins(prev => prev.filter(admin => admin.id !== selectedUserId));
      NotyfService.showSuccess("Administrator erfolgreich entfernt");
      setIsRemoveModalOpen(false);
      setSelectedUserId(null);
    } catch (error) {
      let errorMessage = "Fehler beim Entfernen des Administrators";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      NotyfService.showError(errorMessage);
    }
  };

  // Show loading spinner while fetching admins
  if (isLoading) return <Loading />;

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Administratoren verwalten</h1>
        <Text>Suchen Sie nach Benutzern und weisen Sie Administratorrechte zu oder entfernen Sie diese.</Text>
      </div>

      {/* User search and add admin section */}
      <Card>
        <Title className="mb-4">Benutzer suchen und als Administrator hinzufügen</Title>
        <div className="flex items-center space-x-2 mb-4">
          <TextInput
            placeholder="Nach Benutzern suchen"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <Button
            icon={MagnifyingGlassIcon}
            onClick={handleSearch}
            loading={isSearching}
            color="blue"
          >
            Suchen
          </Button>
        </div>

        {/* Display search results */}
        {searchResults.length > 0 && (
          <div className="mb-6">
            <Text className="font-medium mb-2">Suchergebnisse</Text>
            <Grid numItemsLg={3} numItemsMd={2} numItemsSm={1} className="gap-3">
              {searchResults.map(user => (
                <Card key={user.id} className="!p-3">
                  <Flex alignItems="center" justifyContent="between">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div>
                        <Text className="font-medium">{user.username}</Text>
                        <Text className="text-xs text-gray-400">
                          ID: {user.id}
                        </Text>
                      </div>
                    </div>
                    {/* Button to add user as admin */}
                    <Button
                      icon={UserPlusIcon}
                      variant="light"
                      color="blue"
                      tooltip="Als Administrator hinzufügen"
                      onClick={() => addUserAsAdmin(user)}
                    />
                  </Flex>
                </Card>
              ))}
            </Grid>
          </div>
        )}

        {/* Message if no users found */}
        {searchResults.length === 0 && searchQuery && !isSearching && (
          <Text className="text-gray-500 italic mb-4">Keine Benutzer gefunden. Senden Sie die Suchanfrage ab oder versuchen Sie eine andere Suchanfrage.</Text>
        )}
      </Card>

      {/* List of current admins */}
      <Card>
        <Title className="mb-4">Aktuelle Administratoren</Title>
        {admins.length === 0 ? (
          <Text className="text-gray-500 italic">Keine Administratoren vorhanden.</Text>
        ) : (
          <div className="space-y-3">
            {admins.map(admin => (
              <Card key={admin.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div>
                      <Text className="font-medium">{admin.username}</Text>
                      <Text className="text-xs text-gray-400">
                        ID: {admin.id}
                      </Text>
                    </div>
                  </div>
                  {/* Button to remove admin, hidden for self */}
                  {userService.getUserID() !== admin.id && (
                    <div>
                      <Button
                        size="sm"
                        variant="light"
                        color="red"
                        icon={TrashIcon}
                        tooltip="Administrator-Status entfernen"
                        onClick={() => confirmRemoveAdmin(admin.id)}
                      />
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {/* Confirmation dialog for removing admin */}
      <Dialog open={isRemoveModalOpen} onClose={() => setIsRemoveModalOpen(false)}>
        <DialogPanel className="max-w-sm bg-white rounded-xl shadow-md p-6">
          <Title>Administrator-Status entfernen</Title>
          <Text className="my-4">
            Möchten Sie diesen Benutzer wirklich als Administrator entfernen? Der Benutzer verliert damit alle Administratorrechte.
          </Text>
          <Flex justifyContent="end" className="space-x-2">
            <Button variant="secondary" onClick={() => setIsRemoveModalOpen(false)}>
              Abbrechen
            </Button>
            <Button color="red" onClick={handleRemoveAdmin}>
              Entfernen
            </Button>
          </Flex>
        </DialogPanel>
      </Dialog>
    </div>
  );
};

export default AdminManagement;