import { useState, useEffect } from 'react';
import {
  Card,
  Title,
  Text,
  Badge,
  Flex,
  Grid,
  Col,
  Divider,
  Button,
  Callout,
  Select,
  SelectItem,
  TextInput,
  Subtitle,
  DatePicker,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Dialog, // Using Tremor's Dialog instead of AlertDialog
  DialogPanel // Using Tremor's DialogPanel
} from '@tremor/react';

// Komponente für eine einzelne Personenkarte im Stammbaum
const PersonCard = ({ person, onSelect, isSelected, isAdd = false }) => {
  if (isAdd) {
    return (
      <div 
        className="w-40 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors"
        onClick={onSelect}
      >
        <div className="text-center">
          <div className="mx-auto bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mb-2">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <Text>Person hinzufügen</Text>
        </div>
      </div>
    );
  }
  
  const cardBorder = isSelected 
    ? 'border-2 border-blue-500' 
    : 'border border-gray-200';
  
  return (
    <Card 
      className={`w-40 p-0 cursor-pointer transform transition-all ${cardBorder} ${isSelected ? 'shadow-md scale-105' : 'hover:shadow-md hover:scale-105'}`}
      onClick={() => onSelect(person.id)}
    >
      <div className="p-3">
        <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden bg-gray-100">
          {person.photo ? (
            <img 
              src={person.photo} 
              alt={`${person.firstName} ${person.lastName}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
        </div>
        
        <div className="text-center">
          <Title className="truncate text-base">{person.firstName}</Title>
          <Title className="truncate text-base">{person.lastName}</Title>
          <Text className="text-xs">{person.birthDate ? new Date(person.birthDate).getFullYear() : '?'} - {person.deathDate ? new Date(person.deathDate).getFullYear() : person.isDeceased ? '?' : ''}</Text>
          
          {person.memorySpaceCount > 0 && (
            <Badge size="xs" color="blue" className="mt-1">
              {person.memorySpaceCount} Erinnerungsräume
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
};

// Komponente für ein Paar/eine Beziehung im Stammbaum
const CoupleNode = ({ couple, onPersonSelect, selectedPersonId }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex space-x-3 items-center">
        <PersonCard 
          person={couple.person1} 
          onSelect={onPersonSelect}
          isSelected={selectedPersonId === couple.person1.id}
        />
        
        <div className="h-px w-8 bg-gray-300">
          {couple.relationshipType === 'marriage' && (
            <div className="relative -top-2 w-full flex justify-center">
              <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        
        {couple.person2 ? (
          <PersonCard 
            person={couple.person2} 
            onSelect={onPersonSelect}
            isSelected={selectedPersonId === couple.person2.id}
          />
        ) : (
          <PersonCard isAdd={true} onSelect={() => onPersonSelect('add', couple.person1.id)} />
        )}
      </div>
      
      {/* Verbindungslinie zu Kindern */}
      {couple.children && couple.children.length > 0 && (
        <>
          <div className="w-px h-8 bg-gray-300"></div>
          <div className="w-full">
            <div className="relative">
              <div className="absolute left-0 right-0 top-0 h-px bg-gray-300"></div>
              <div className="flex justify-around">
                {couple.children.map(child => (
                  <div key={child.id} className="flex flex-col items-center">
                    <div className="w-px h-8 bg-gray-300"></div>
                    <PersonCard 
                      person={child} 
                      onSelect={onPersonSelect}
                      isSelected={selectedPersonId === child.id}
                    />
                  </div>
                ))}
                <div className="flex flex-col items-center">
                  <div className="w-px h-8 bg-gray-300"></div>
                  <PersonCard isAdd={true} onSelect={() => onPersonSelect('add-child', couple.person1.id, couple.person2?.id)} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Komponente für eine Generation im Stammbaum
const GenerationGroup = ({ couples, onPersonSelect, selectedPersonId }) => {
  return (
    <div className="flex flex-wrap justify-start gap-12 py-8">
      {couples.map((couple, index) => (
        <CoupleNode 
          key={`couple-${index}`}
          couple={couple} 
          onPersonSelect={onPersonSelect}
          selectedPersonId={selectedPersonId}
        />
      ))}
    </div>
  );
};

// Formular zum Hinzufügen/Bearbeiten einer Person
const PersonForm = ({ person, onSave, onCancel, mode = 'edit' }) => {
  const [formData, setFormData] = useState({
    firstName: person?.firstName || '',
    lastName: person?.lastName || '',
    birthDate: person?.birthDate ? new Date(person.birthDate) : null,
    deathDate: person?.deathDate ? new Date(person.deathDate) : null,
    isDeceased: person?.isDeceased || false,
    birthPlace: person?.birthPlace || '',
    gender: person?.gender || 'other',
    notes: person?.notes || '',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave({
      id: person?.id || `person-${Date.now()}`,
      ...formData,
      photo: person?.photo || null,
      memorySpaceCount: person?.memorySpaceCount || 0
    });
  };

  const isCreateMode = mode === 'create';
  const title = isCreateMode ? 'Person hinzufügen' : 'Person bearbeiten';

  return (
    <Card className="max-w-xl">
      <Title>{title}</Title>
      <Divider />
      
      <Grid numItems={1} numItemsSm={2} className="gap-4 mt-4">
        <TextInput
          label="Vorname"
          placeholder="Vorname eingeben"
          value={formData.firstName}
          onChange={(e) => handleChange('firstName', e.target.value)}
        />
        
        <TextInput
          label="Nachname"
          placeholder="Nachname eingeben"
          value={formData.lastName}
          onChange={(e) => handleChange('lastName', e.target.value)}
        />
        
        <div>
          <Text className="mb-2">Geburtsdatum</Text>
          <DatePicker
            value={formData.birthDate}
            onValueChange={(date) => handleChange('birthDate', date)}
            placeholder="Geburtsdatum auswählen"
          />
        </div>
        
        <TextInput
          label="Geburtsort"
          placeholder="Geburtsort eingeben"
          value={formData.birthPlace}
          onChange={(e) => handleChange('birthPlace', e.target.value)}
        />
        
        <div>
          <Text className="mb-2">Geschlecht</Text>
          <Select
            value={formData.gender}
            onValueChange={(value) => handleChange('gender', value)}
          >
            <SelectItem value="male">Männlich</SelectItem>
            <SelectItem value="female">Weiblich</SelectItem>
            <SelectItem value="other">Divers</SelectItem>
          </Select>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isDeceased"
            checked={formData.isDeceased}
            onChange={(e) => handleChange('isDeceased', e.target.checked)}
            className="h-4 w-4 text-blue-600 rounded"
          />
          <label htmlFor="isDeceased" className="ml-2 text-sm text-gray-700">
            Verstorben
          </label>
        </div>
        
        {formData.isDeceased && (
          <div>
            <Text className="mb-2">Sterbedatum</Text>
            <DatePicker
              value={formData.deathDate}
              onValueChange={(date) => handleChange('deathDate', date)}
              placeholder="Sterbedatum auswählen"
            />
          </div>
        )}
        
        <div className="sm:col-span-2">
          <Text className="mb-2">Notizen</Text>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Weitere Informationen..."
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
          />
        </div>
      </Grid>
      
      <Flex className="mt-6" justifyContent="end">
        <Button variant="secondary" onClick={onCancel}>Abbrechen</Button>
        <Button color="blue" onClick={handleSubmit}>Speichern</Button>
      </Flex>
    </Card>
  );
};

// Hauptkomponente für den Stammbaum
const FamilyTree = () => {
  const [people, setPeople] = useState([]);
  const [couples, setCouples] = useState([]);
  const [selectedPersonId, setSelectedPersonId] = useState(null);
  const [isAddingPerson, setIsAddingPerson] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [addMode, setAddMode] = useState('single'); // 'single', 'partner', 'child'
  const [relationToId, setRelationToId] = useState(null);
  const [secondParentId, setSecondParentId] = useState(null);
  const [activeView, setActiveView] = useState('tree'); // 'tree', 'list', 'chart'
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [personToDeleteId, setPersonToDeleteId] = useState(null);

  // Beispieldaten laden
  useEffect(() => {
    const loadFamilyData = async () => {
      setIsLoading(true);
      try {
        // Simulierte API-Anfrage
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Beispiel-Personen
        const mockPeople = [
          {
            id: 'p1',
            firstName: 'Hans',
            lastName: 'Müller',
            birthDate: '1940-05-15',
            deathDate: '2015-11-22',
            isDeceased: true,
            birthPlace: 'Berlin',
            gender: 'male',
            photo: '/api/placeholder/200/200',
            memorySpaceCount: 2,
            notes: 'Großvater väterlicherseits'
          },
          {
            id: 'p2',
            firstName: 'Erika',
            lastName: 'Müller',
            birthDate: '1942-08-30',
            deathDate: null,
            isDeceased: false,
            birthPlace: 'München',
            gender: 'female',
            photo: '/api/placeholder/200/200',
            memorySpaceCount: 1,
            notes: 'Großmutter väterlicherseits'
          },
          {
            id: 'p3',
            firstName: 'Thomas',
            lastName: 'Müller',
            birthDate: '1965-12-04',
            deathDate: null,
            isDeceased: false,
            birthPlace: 'Frankfurt',
            gender: 'male',
            photo: '/api/placeholder/200/200',
            memorySpaceCount: 3,
            notes: 'Vater'
          },
          {
            id: 'p4',
            firstName: 'Marie',
            lastName: 'Müller',
            birthDate: '1970-03-22',
            deathDate: null,
            isDeceased: false,
            birthPlace: 'Hamburg',
            gender: 'female',
            photo: '/api/placeholder/200/200',
            memorySpaceCount: 1,
            notes: 'Mutter'
          },
          {
            id: 'p5',
            firstName: 'Anna',
            lastName: 'Müller',
            birthDate: '1995-07-18',
            deathDate: null,
            isDeceased: false,
            birthPlace: 'Berlin',
            gender: 'female',
            photo: '/api/placeholder/200/200',
            memorySpaceCount: 2,
            notes: 'Tochter'
          },
          {
            id: 'p6',
            firstName: 'Michael',
            lastName: 'Müller',
            birthDate: '1997-09-30',
            deathDate: null,
            isDeceased: false,
            birthPlace: 'Berlin',
            gender: 'male',
            photo: '/api/placeholder/200/200',
            memorySpaceCount: 0,
            notes: 'Sohn'
          }
        ];
        
        // Beispiel-Beziehungen/Paare
        const mockCouples = [
          {
            id: 'c1',
            person1: mockPeople.find(p => p.id === 'p1'),
            person2: mockPeople.find(p => p.id === 'p2'),
            relationshipType: 'marriage',
            startDate: '1962-06-10',
            endDate: null,
            children: [mockPeople.find(p => p.id === 'p3')]
          },
          {
            id: 'c2',
            person1: mockPeople.find(p => p.id === 'p3'),
            person2: mockPeople.find(p => p.id === 'p4'),
            relationshipType: 'marriage',
            startDate: '1994-05-22',
            endDate: null,
            children: [
              mockPeople.find(p => p.id === 'p5'),
              mockPeople.find(p => p.id === 'p6')
            ]
          }
        ];
        
        setPeople(mockPeople);
        setCouples(mockCouples);
      } catch (error) {
        console.error('Fehler beim Laden der Familiendaten:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFamilyData();
  }, []);

  // Person auswählen
  const handlePersonSelect = (personId, relationPersonId = null, secondRelationId = null) => {
    if (personId === 'add') {
      // Neue Person als Partner hinzufügen
      setAddMode('partner');
      setRelationToId(relationPersonId);
      setIsAddingPerson(true);
    } else if (personId === 'add-child') {
      // Neue Person als Kind hinzufügen
      setAddMode('child');
      setRelationToId(relationPersonId);
      setSecondParentId(secondRelationId);
      setIsAddingPerson(true);
    } else {
      setSelectedPersonId(personId);
    }
  };

  // Person speichern (neu oder bearbeitet)
  const handleSavePerson = (personData) => {
    // Wenn es eine existierende Person ist, aktualisieren
    if (personData.id && people.some(p => p.id === personData.id)) {
      setPeople(prevPeople => 
        prevPeople.map(p => 
          p.id === personData.id ? { ...p, ...personData } : p
        )
      );
      
      // Beziehungen aktualisieren
      setCouples(prevCouples => 
        prevCouples.map(couple => {
          const updatedCouple = { ...couple };
          
          // Person1 aktualisieren
          if (couple.person1.id === personData.id) {
            updatedCouple.person1 = personData;
          }
          
          // Person2 aktualisieren
          if (couple.person2 && couple.person2.id === personData.id) {
            updatedCouple.person2 = personData;
          }
          
          // Kinder aktualisieren
          if (couple.children) {
            updatedCouple.children = couple.children.map(child => 
              child.id === personData.id ? personData : child
            );
          }
          
          return updatedCouple;
        })
      );
    } else {
      // Neue Person
      setPeople(prev => [...prev, personData]);
      
      // Je nach Modus: Partner oder Kind hinzufügen
      if (addMode === 'partner' && relationToId) {
        const existingPerson = people.find(p => p.id === relationToId);
        
        // Prüfen, ob bereits in einer Beziehung
        const existingCouple = couples.find(c => 
          c.person1.id === relationToId || (c.person2 && c.person2.id === relationToId)
        );
        
        if (existingCouple) {
          // Bestehende Beziehung aktualisieren
          if (existingCouple.person1.id === relationToId && !existingCouple.person2) {
            setCouples(prev => 
              prev.map(c => 
                c.id === existingCouple.id 
                  ? { ...c, person2: personData } 
                  : c
              )
            );
          }
        } else {
          // Neue Beziehung erstellen
          const newCouple = {
            id: `couple-${Date.now()}`,
            person1: existingPerson,
            person2: personData,
            relationshipType: 'relationship',
            startDate: new Date().toISOString().split('T')[0],
            endDate: null,
            children: []
          };
          
          setCouples(prev => [...prev, newCouple]);
        }
      } else if (addMode === 'child' && relationToId) {
        // Kind zu bestehendem Paar hinzufügen
        const parentCouple = couples.find(c => 
          c.person1.id === relationToId || 
          (c.person2 && c.person2.id === relationToId)
        );
        
        if (parentCouple) {
          setCouples(prev => 
            prev.map(c => 
              c.id === parentCouple.id 
                ? { 
                    ...c, 
                    children: [...(c.children || []), personData]
                  }
                : c
            )
          );
        }
      }
    }
    
    setIsAddingPerson(false);
  };

  // Person-Detailansicht
  const selectedPerson = people.find(p => p.id === selectedPersonId);
  
  // Person löschen
  const handleDeletePerson = (personId) => {
    setPersonToDeleteId(personId);
    setIsDeleteModalOpen(true);
  };

  const confirmDeletePerson = () => {
    if (!personToDeleteId) return;

    // Person aus der Liste entfernen
    setPeople(prev => prev.filter(p => p.id !== personToDeleteId));
    
    // Person aus Beziehungen entfernen
    setCouples(prev => {
      return prev.map(couple => {
        // Wenn es Person1 ist
        if (couple.person1.id === personToDeleteId) {
          // Wenn es keine Person2 gibt, die ganze Beziehung entfernen
          if (!couple.person2) {
            return null;
          }
          // Sonst Person1 durch Person2 ersetzen und Person2 leeren
          return {
            ...couple,
            person1: couple.person2,
            person2: null
          };
        }
        
        // Wenn es Person2 ist, diese entfernen
        if (couple.person2 && couple.person2.id === personToDeleteId) {
          return {
            ...couple,
            person2: null
          };
        }
        
        // Wenn es ein Kind ist, dieses aus der Liste entfernen
        if (couple.children && couple.children.some(child => child.id === personToDeleteId)) {
          return {
            ...couple,
            children: couple.children.filter(child => child.id !== personToDeleteId)
          };
        }
        
        return couple;
      }).filter(Boolean); // Null-Einträge entfernen
    });
    
    // Auswahl zurücksetzen
    setSelectedPersonId(null);
    
    // Modal schließen
    setIsDeleteModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="text-blue-500">
          <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Title>Stammbaum</Title>
        <Text>Erstellen und verwalten Sie Ihren Familienstammbaum</Text>
      </div>
      
      {/* Ansichtsschaltflächen */}
      <TabGroup defaultIndex={0}>
        <TabList variant="solid">
          <Tab 
            icon={() => (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            )}
            onClick={() => setActiveView('tree')}
          >
            Stammbaum
          </Tab>
          <Tab 
            icon={() => (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            )}
            onClick={() => setActiveView('list')}
          >
            Personenliste
          </Tab>
          <Tab 
            icon={() => (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
              </svg>
            )}
            onClick={() => setActiveView('chart')}
          >
            Statistik
          </Tab>
        </TabList>
      </TabGroup>

      {/* Hauptinhalt basierend auf aktiver Ansicht */}
      <Grid numItems={1} numItemsLg={3} className="gap-6">
        {/* Stammbaum-Bereich */}
        <Col numColSpan={1} numColSpanLg={2}>
          <Card className="overflow-x-auto">
            {activeView === 'tree' && (
              <div className="min-w-max">
                {couples.length > 0 ? (
                  <div className="p-4">
                    {/* Erste Generation (Großeltern) */}
                    <GenerationGroup 
                      couples={couples.filter(c => 
                        !c.children || c.children.every(child => 
                          !couples.some(otherCouple => 
                            otherCouple.children && otherCouple.children.some(grandchild => 
                              couples.some(c3 => 
                                c3.person1.id === child.id || (c3.person2 && c3.person2.id === child.id)
                              )
                            )
                          )
                        )
                      )}
                      onPersonSelect={handlePersonSelect}
                      selectedPersonId={selectedPersonId}
                    />
                    
                    {/* Zweite Generation (Eltern) */}
                    <GenerationGroup 
                      couples={couples.filter(c => 
                        c.children && c.children.some(child => 
                          couples.some(otherCouple => 
                            otherCouple.person1.id === child.id || (otherCouple.person2 && otherCouple.person2.id === child.id)
                          )
                        )
                      )}
                      onPersonSelect={handlePersonSelect}
                      selectedPersonId={selectedPersonId}
                    />
                    
                    {/* Dritte Generation (Kinder) */}
                    <GenerationGroup 
                      couples={couples.filter(c => 
                        !couples.some(otherCouple => 
                          otherCouple.children && otherCouple.children.some(child => 
                            c.person1.id === child.id || (c.person2 && c.person2.id === child.id)
                          )
                        )
                      )}
                      onPersonSelect={handlePersonSelect}
                      selectedPersonId={selectedPersonId}
                    />
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="mx-auto bg-gray-100 rounded-full p-6 w-16 h-16 flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <Title>Stammbaum ist leer</Title>
                    <Text className="mt-2">
                      Beginnen Sie mit dem Hinzufügen von Familienmitgliedern.
                    </Text>
                    <div className="mt-6">
                      <Button size="sm" color="blue" icon={() => (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      )} onClick={() => {
                        setAddMode('single');
                        setIsAddingPerson(true);
                      }}>
                        Person hinzufügen
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {activeView === 'list' && (
              <div>
                <Flex justifyContent="between" alignItems="center" className="mb-4">
                  <Title>Personenliste</Title>
                  <Button size="sm" color="blue" icon={() => (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  )} onClick={() => {
                    setAddMode('single');
                    setIsAddingPerson(true);
                  }}>
                    Person hinzufügen
                  </Button>
                </Flex>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {people.map(person => (
                    <Card key={person.id} decoration="left" decorationColor={person.gender === 'male' ? 'blue' : person.gender === 'female' ? 'pink' : 'gray'} className="cursor-pointer" onClick={() => setSelectedPersonId(person.id)}>
                      <Flex>
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                          {person.photo ? (
                            <img 
                              src={person.photo} 
                              alt={`${person.firstName} ${person.lastName}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        
                        <div className="ml-3">
                          <Title className="text-base">{person.firstName} {person.lastName}</Title>
                          <Text className="text-xs">
                            {person.birthDate ? new Date(person.birthDate).toLocaleDateString('de-DE') : 'Unbekannt'}
                            {person.isDeceased && ' - '}
                            {person.deathDate && new Date(person.deathDate).toLocaleDateString('de-DE')}
                          </Text>
                          
                          {person.memorySpaceCount > 0 && (
                            <Badge size="xs" color="blue" className="mt-1">
                              {person.memorySpaceCount} Erinnerungsräume
                            </Badge>
                          )}
                        </div>
                      </Flex>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            
            {activeView === 'chart' && (
              <div className="text-center py-8">
                <div className="mx-auto bg-blue-100 rounded-full p-6 w-16 h-16 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                  </svg>
                </div>
                <Title>Statistik</Title>
                <Text className="mt-2">
                  Hier würden Statistiken und Visualisierungen zu Ihrem Stammbaum angezeigt werden.
                </Text>
                <Text className="mt-1 text-gray-500">
                  Zum Beispiel Altersverteilung, Ortsverteilung und Zeitlinien.
                </Text>
              </div>
            )}
          </Card>
        </Col>
        
        {/* Seitenleiste für Details oder Formular */}
        <Col numColSpan={1}>
          {isAddingPerson ? (
            <PersonForm 
              mode="create"
              onSave={handleSavePerson} 
              onCancel={() => setIsAddingPerson(false)}
            />
          ) : selectedPerson ? (
            <Card>
              <div className="text-center mb-4">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gray-100 mb-3">
                  {selectedPerson.photo ? (
                    <img 
                      src={selectedPerson.photo} 
                      alt={`${selectedPerson.firstName} ${selectedPerson.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <Title>{selectedPerson.firstName} {selectedPerson.lastName}</Title>
                
                <div className="flex justify-center space-x-2 mt-2">
                  <Badge 
                    color={selectedPerson.gender === 'male' ? 'blue' : selectedPerson.gender === 'female' ? 'pink' : 'gray'}
                  >
                    {selectedPerson.gender === 'male' ? 'Männlich' : selectedPerson.gender === 'female' ? 'Weiblich' : 'Divers'}
                  </Badge>
                  
                  {selectedPerson.isDeceased && (
                    <Badge color="gray">Verstorben</Badge>
                  )}
                </div>
              </div>
              
              <Divider />
              
              <div className="space-y-3 mt-3">
                <div>
                  <Text className="text-gray-500">Geburtsdatum</Text>
                  <Text className="font-medium">
                    {selectedPerson.birthDate 
                      ? new Date(selectedPerson.birthDate).toLocaleDateString('de-DE') 
                      : 'Unbekannt'}
                  </Text>
                </div>
                
                {selectedPerson.birthPlace && (
                  <div>
                    <Text className="text-gray-500">Geburtsort</Text>
                    <Text className="font-medium">{selectedPerson.birthPlace}</Text>
                  </div>
                )}
                
                {selectedPerson.isDeceased && (
                  <div>
                    <Text className="text-gray-500">Sterbedatum</Text>
                    <Text className="font-medium">
                      {selectedPerson.deathDate 
                        ? new Date(selectedPerson.deathDate).toLocaleDateString('de-DE') 
                        : 'Unbekannt'}
                    </Text>
                  </div>
                )}
                
                {/* Eltern */}
                <div>
                  <Text className="text-gray-500">Eltern</Text>
                  {couples.some(couple => 
                    couple.children && couple.children.some(child => child.id === selectedPerson.id)
                  ) ? (
                    couples
                      .filter(couple => 
                        couple.children && couple.children.some(child => child.id === selectedPerson.id)
                      )
                      .map((couple, index) => (
                        <div key={index} className="flex items-center space-x-1 mt-1">
                          <Button 
                            size="xs" 
                            variant="light" 
                            color="blue"
                            onClick={() => setSelectedPersonId(couple.person1.id)}
                          >
                            {couple.person1.firstName} {couple.person1.lastName}
                          </Button>
                          
                          {couple.person2 && (
                            <>
                              <span>&</span>
                              <Button 
                                size="xs" 
                                variant="light" 
                                color="blue"
                                onClick={() => setSelectedPersonId(couple.person2.id)}
                              >
                                {couple.person2.firstName} {couple.person2.lastName}
                              </Button>
                            </>
                          )}
                        </div>
                      ))
                  ) : (
                    <Text>Keine Eltern eingetragen</Text>
                  )}
                </div>
                
                {/* Partner */}
                <div>
                  <Text className="text-gray-500">Partner</Text>
                  {couples.some(couple => 
                    couple.person1.id === selectedPerson.id || (couple.person2 && couple.person2.id === selectedPerson.id)
                  ) ? (
                    couples
                      .filter(couple => 
                        couple.person1.id === selectedPerson.id || (couple.person2 && couple.person2.id === selectedPerson.id)
                      )
                      .map((couple, index) => {
                        const partner = couple.person1.id === selectedPerson.id 
                          ? couple.person2 
                          : couple.person1;
                        
                        return partner ? (
                          <div key={index} className="mt-1">
                            <Button 
                              size="xs" 
                              variant="light" 
                              color="blue"
                              onClick={() => setSelectedPersonId(partner.id)}
                            >
                              {partner.firstName} {partner.lastName}
                            </Button>
                            
                            <Badge size="xs" color="gray" className="ml-2">
                              {couple.relationshipType === 'marriage' ? 'Ehe' : 'Beziehung'}
                            </Badge>
                          </div>
                        ) : (
                          <Button 
                            key={index}
                            size="xs" 
                            variant="light" 
                            color="gray"
                            icon={() => (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            )}
                            onClick={() => {
                              setAddMode('partner');
                              setRelationToId(selectedPerson.id);
                              setIsAddingPerson(true);
                            }}
                          >
                            Partner hinzufügen
                          </Button>
                        );
                      })
                  ) : (
                    <Button 
                      size="xs" 
                      variant="light" 
                      color="gray"
                      icon={() => (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      )}
                      onClick={() => {
                        setAddMode('partner');
                        setRelationToId(selectedPerson.id);
                        setIsAddingPerson(true);
                      }}
                    >
                      Partner hinzufügen
                    </Button>
                  )}
                </div>
                
                {/* Kinder */}
                <div>
                  <Text className="text-gray-500">Kinder</Text>
                  {couples.some(couple => 
                    (couple.person1.id === selectedPerson.id || (couple.person2 && couple.person2.id === selectedPerson.id)) &&
                    couple.children && couple.children.length > 0
                  ) ? (
                    couples
                      .filter(couple => 
                        (couple.person1.id === selectedPerson.id || (couple.person2 && couple.person2.id === selectedPerson.id)) &&
                        couple.children && couple.children.length > 0
                      )
                      .map(couple => couple.children)
                      .flat()
                      .map((child, index) => (
                        <div key={index} className="mt-1">
                          <Button 
                            size="xs" 
                            variant="light" 
                            color="blue"
                            onClick={() => setSelectedPersonId(child.id)}
                          >
                            {child.firstName} {child.lastName}
                          </Button>
                        </div>
                      ))
                  ) : (
                    <Text>Keine Kinder eingetragen</Text>
                  )}
                </div>
                
                {/* Notizen */}
                {selectedPerson.notes && (
                  <div>
                    <Text className="text-gray-500">Notizen</Text>
                    <Text>{selectedPerson.notes}</Text>
                  </div>
                )}
                
                {/* Aktionen */}
                <div className="pt-4 flex justify-end space-x-2">
                  <Button
                    size="sm"
                    variant="light"
                    color="gray"
                    onClick={() => setSelectedPersonId(null)}
                  >
                    Schließen
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="light"
                    color="blue"
                    icon={() => (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    )}
                    onClick={() => {
                      setAddMode('edit');
                      setIsAddingPerson(true);
                    }}
                  >
                    Bearbeiten
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="light"
                    color="red"
                    icon={() => (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                    onClick={() => handleDeletePerson(selectedPerson.id)}
                  >
                    Löschen
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="text-center py-6">
                <div className="mx-auto bg-blue-100 rounded-full p-6 w-16 h-16 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                
                <Title>Personen-Details</Title>
                <Text className="mt-2">
                  Wählen Sie eine Person im Stammbaum aus, um Details anzuzeigen.
                </Text>
                
                <div className="mt-6">
                  <Button
                    size="sm"
                    color="blue"
                    icon={() => (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    )}
                    onClick={() => {
                      setAddMode('single');
                      setIsAddingPerson(true);
                    }}
                  >
                    Neue Person hinzufügen
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </Col>
      </Grid>
      
      {/* Bestätigungsdialog für das Löschen */}
      <Dialog open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <DialogPanel>
          <div className="p-6">
            <Title>Person löschen</Title>
            <Text className="mt-2">
              Soll diese Person wirklich gelöscht werden? Diese Aktion kann nicht rückgängig gemacht werden.
            </Text>
            
            <Flex justifyContent="end" className="mt-8 space-x-2">
              <Button 
                variant="secondary" 
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Abbrechen
              </Button>
              <Button 
                color="red" 
                onClick={confirmDeletePerson}
              >
                Löschen
              </Button>
            </Flex>
          </div>
        </DialogPanel>
      </Dialog>
    </div>
  );
};

export default FamilyTree;