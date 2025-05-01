import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Card, Title, Text, Metric, ProgressBar, Flex, Button, TextInput, Grid, Col } from '@tremor/react';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
  });

  // Speichernutzung berechnen
  const storagePercentage = user?.storage 
    ? Math.round((user.storage.used / user.storage.total) * 100) 
    : 0;
  
  // Formatierung der Speichergröße in GB
  const formatStorage = (bytes) => {
    return (bytes / 1000000000).toFixed(1) + ' GB';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Hier würde in einer echten App ein API-Aufruf erfolgen
    console.log('Profil aktualisieren mit:', formData);
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-xl font-medium text-gray-900">Nicht angemeldet</h2>
        <p className="mt-2 text-gray-600">
          Bitte melden Sie sich an, um Ihr Profil anzuzeigen.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Title>Mein Profil</Title>
        <Text>Persönliche Informationen und Kontoeinstellungen</Text>
      </div>

      <Grid numItems={1} numItemsMd={2} className="gap-6">
        <Col>
          <Card>
            {isEditing ? (
              <div className="space-y-4">
                <Title>Profil bearbeiten</Title>
                
                <div>
                  <Text className="mb-1">Name</Text>
                  <TextInput 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ihr Name"
                  />
                </div>
                
                <div>
                  <Text className="mb-1">E-Mail</Text>
                  <TextInput 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="ihre@email.de"
                    disabled
                  />
                  <Text className="mt-1 text-xs text-gray-500">
                    Die E-Mail-Adresse kann nicht geändert werden.
                  </Text>
                </div>
                
                <div>
                  <Text className="mb-1">Über mich</Text>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows={4}
                    placeholder="Erzählen Sie etwas über sich..."
                  />
                </div>
                
                <Flex justifyContent="end" className="pt-4">
                  <Button
                    variant="secondary"
                    color="gray"
                    onClick={() => setIsEditing(false)}
                  >
                    Abbrechen
                  </Button>
                  <Button
                    color="blue"
                    onClick={handleSubmit}
                  >
                    Speichern
                  </Button>
                </Flex>
              </div>
            ) : (
              <div>
                <div className="mb-6 text-center">
                  <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.username} 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-semibold text-gray-500">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <Title>{user.name}</Title>
                  <Text>{user.email}</Text>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Text className="text-gray-500">Rolle</Text>
                    <Text className="font-medium mt-1">
                      {user.role === 'admin' ? 'Administrator' : 'Benutzer'}
                    </Text>
                  </div>
                  
                  <div>
                    <Text className="text-gray-500">Über mich</Text>
                    <Text className="mt-1">
                      {user.bio || 'Keine Biografie vorhanden.'}
                    </Text>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button 
                    variant="light"
                    color="blue"
                    onClick={() => setIsEditing(true)}
                    icon={() => (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    )}
                  >
                    Profil bearbeiten
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </Col>
        
        <Col>
          <Card>
            <Title>Speichernutzung</Title>
            <Metric className="mt-2">
              {user.storage && formatStorage(user.storage.used)} von {user.storage && formatStorage(user.storage.total)}
            </Metric>
            
            <ProgressBar value={storagePercentage} color="blue" className="mt-3" />
            
            <Text className="mt-3">
              {storagePercentage}% Ihres Speichers sind belegt
            </Text>
            
            <div className="mt-6 space-y-4">
              <div className="flex justify-between">
                <Text>Bilder</Text>
                <Text className="font-medium">0.8 GB</Text>
              </div>
              <div className="flex justify-between">
                <Text>Videos</Text>
                <Text className="font-medium">0.4 GB</Text>
              </div>
              <div className="flex justify-between">
                <Text>Dokumente</Text>
                <Text className="font-medium">0.2 GB</Text>
              </div>
            </div>
            
            <div className="mt-6">
              <Button 
                variant="secondary" 
                color="blue"
                icon={() => (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                )}
              >
                Speicherplatz erweitern
              </Button>
            </div>
          </Card>
          
          <Card className="mt-6">
            <Title>Kontoeinstellungen</Title>
            
            <div className="mt-4 space-y-4">
              <Button
                variant="light"
                color="blue"
                icon={() => (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                )}
                className="w-full justify-start"
              >
                Passwort ändern
              </Button>
              
              <Button
                variant="light"
                color="purple"
                icon={() => (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )}
                className="w-full justify-start"
              >
                Datenschutzeinstellungen
              </Button>
              
              <Button
                variant="light"
                color="red"
                icon={() => (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
                className="w-full justify-start"
              >
                Konto löschen
              </Button>
            </div>
          </Card>
        </Col>
      </Grid>
    </div>
  );
};

export default ProfilePage;