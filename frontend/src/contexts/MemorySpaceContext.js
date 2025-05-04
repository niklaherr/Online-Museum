import { createContext, useState, useEffect } from 'react';

// Erstellen des Kontexts mit Default-Werten
export const MemorySpaceContext = createContext({
  spaces: [],
  currentSpace: null,
  isLoading: false,
  error: null,
  loadSpaces: () => {},
  loadSpace: () => {},
  createSpace: () => {},
  updateSpace: () => {},
  deleteSpace: () => {},
  addMedia: () => {},
  deleteMedia: () => {},
  updateMedia: () => {},
});

// Beispiel-Daten für die Erinnerungsräume
const mockSpaces = [
  {
    id: '1',
    title: 'Familienurlaub Italien 2022',
    description: 'Unsere Reise durch die Toskana und entlang der Amalfiküste - ein unvergessliches Abenteuer.',
    coverImage: '/api/placeholder/800/400',
    isPrivate: false,
    itemCount: 42,
    createdAt: '2022-06-15T12:00:00Z',
    updatedAt: '2022-06-30T12:00:00Z',
    category: 'Reisen',
    media: [
      {
        id: 'm1',
        type: 'image',
        title: 'Ankunft in Florenz',
        description: 'Unser erster Tag in der Toskana',
        url: '/api/placeholder/800/600',
        date: '2022-06-16T10:30:00Z',
        location: 'Florenz, Italien'
      },
      {
        id: 'm2',
        type: 'image',
        title: 'Sonnenuntergang in Positano',
        description: 'Ein traumhafter Abend an der Amalfiküste',
        url: '/api/placeholder/800/600',
        date: '2022-06-22T19:45:00Z',
        location: 'Positano, Italien'
      },
      {
        id: 'm3',
        type: 'video',
        title: 'Bootstour entlang der Küste',
        description: 'Unsere Fahrt von Amalfi nach Capri',
        url: '/video-placeholder',
        date: '2022-06-24T14:20:00Z',
        location: 'Amalfiküste, Italien'
      }
    ]
  },
  {
    id: '2',
    title: 'Omas Kriegserinnerungen',
    description: 'Gesammelte Geschichten, Briefe und Fotos aus der Kriegszeit 1939-1945.',
    coverImage: '/api/placeholder/800/400',
    isPrivate: true,
    itemCount: 18,
    createdAt: '2023-01-10T09:30:00Z',
    updatedAt: '2023-02-15T09:30:00Z',
    category: 'Kriegserinnerungen',
    media: [
      {
        id: 'm4',
        type: 'document',
        title: 'Briefe aus Berlin',
        description: 'Korrespondenz mit Familie aus den Jahren 1943-1944',
        url: '/document-placeholder',
        date: '1943-05-20T00:00:00Z',
        location: 'Berlin, Deutschland'
      },
      {
        id: 'm5',
        type: 'image',
        title: 'Familienfoto vor dem Krieg',
        description: 'Die gesamte Familie im Sommer 1938',
        url: '/api/placeholder/800/600',
        date: '1938-07-15T00:00:00Z',
        location: 'München, Deutschland'
      }
    ]
  },
  {
    id: '3',
    title: 'Hochzeit von Marie & Thomas',
    description: 'Der schönste Tag im Leben von Marie und Thomas - alle Erinnerungen an diesen besonderen Tag.',
    coverImage: '/api/placeholder/800/400',
    isPrivate: false,
    itemCount: 87,
    createdAt: '2023-09-05T16:45:00Z',
    updatedAt: '2023-09-15T16:45:00Z',
    category: 'Familienfeiern',
    media: [
      {
        id: 'm6',
        type: 'image',
        title: 'Zeremonie',
        description: 'Der Moment des Ja-Worts',
        url: '/api/placeholder/800/600',
        date: '2023-09-02T14:30:00Z',
        location: 'Schloss Elmau, Bayern'
      },
      {
        id: 'm7',
        type: 'video',
        title: 'Erster Tanz',
        description: 'Marie und Thomas eröffnen die Tanzfläche',
        url: '/video-placeholder',
        date: '2023-09-02T19:45:00Z',
        location: 'Schloss Elmau, Bayern'
      },
      {
        id: 'm8',
        type: 'audio',
        title: 'Hochzeitsgelübde',
        description: 'Die bewegenden Worte des Brautpaars',
        url: '/audio-placeholder',
        date: '2023-09-02T14:15:00Z',
        location: 'Schloss Elmau, Bayern'
      }
    ]
  }
];

// MemorySpace Provider Komponente
export const MemorySpaceProvider = ({ children }) => {
  const [spaces, setSpaces] = useState([]);
  const [currentSpace, setCurrentSpace] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Alle Erinnerungsräume laden
  const loadSpaces = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // In einer echten App: API-Aufruf
      // Hier: Simulierte Verzögerung mit Mock-Daten
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSpaces(mockSpaces);
    } catch (err) {
      setError('Fehler beim Laden der Erinnerungsräume');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Einen bestimmten Erinnerungsraum laden
  const loadSpace = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      // In einer echten App: API-Aufruf
      // Hier: Suchen in Mock-Daten
      await new Promise(resolve => setTimeout(resolve, 500));
      const space = mockSpaces.find(s => s.id === id);
      if (space) {
        setCurrentSpace(space);
      } else {
        throw new Error('Erinnerungsraum nicht gefunden');
      }
    } catch (err) {
      setError('Fehler beim Laden des Erinnerungsraums');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Neuen Erinnerungsraum erstellen
  const createSpace = async (spaceData) => {
    setIsLoading(true);
    setError(null);
    try {
      // In einer echten App: API-Aufruf
      // Hier: Simulierte Erstellung
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newSpace = {
        id: `space-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        itemCount: 0,
        media: [],
        ...spaceData
      };
      
      setSpaces(prevSpaces => [...prevSpaces, newSpace]);
      return newSpace;
    } catch (err) {
      setError('Fehler beim Erstellen des Erinnerungsraums');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Erinnerungsraum aktualisieren
  const updateSpace = async (id, updates) => {
    setIsLoading(true);
    setError(null);
    try {
      // In einer echten App: API-Aufruf
      // Hier: Simulierte Aktualisierung
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setSpaces(prevSpaces => 
        prevSpaces.map(space => 
          space.id === id 
            ? { 
                ...space, 
                ...updates, 
                updatedAt: new Date().toISOString() 
              } 
            : space
        )
      );
      
      if (currentSpace && currentSpace.id === id) {
        setCurrentSpace(prev => ({ ...prev, ...updates, updatedAt: new Date().toISOString() }));
      }
      
      return true;
    } catch (err) {
      setError('Fehler beim Aktualisieren des Erinnerungsraums');
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Erinnerungsraum löschen
  const deleteSpace = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      // In einer echten App: API-Aufruf
      // Hier: Simulierte Löschung
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setSpaces(prevSpaces => prevSpaces.filter(space => space.id !== id));
      
      if (currentSpace && currentSpace.id === id) {
        setCurrentSpace(null);
      }
      
      return true;
    } catch (err) {
      setError('Fehler beim Löschen des Erinnerungsraums');
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Medien zu einem Erinnerungsraum hinzufügen
  const addMedia = async (spaceId, mediaData) => {
    setIsLoading(true);
    setError(null);
    try {
      // In einer echten App: API-Aufruf
      // Hier: Simulierte Hinzufügung
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newMedia = {
        id: `media-${Date.now()}`,
        date: new Date().toISOString(),
        ...mediaData
      };
      
      setSpaces(prevSpaces => 
        prevSpaces.map(space => {
          if (space.id === spaceId) {
            return {
              ...space,
              media: [...space.media, newMedia],
              itemCount: space.itemCount + 1,
              updatedAt: new Date().toISOString()
            };
          }
          return space;
        })
      );
      
      if (currentSpace && currentSpace.id === spaceId) {
        setCurrentSpace(prev => ({
          ...prev,
          media: [...prev.media, newMedia],
          itemCount: prev.itemCount + 1,
          updatedAt: new Date().toISOString()
        }));
      }
      
      return newMedia;
    } catch (err) {
      setError('Fehler beim Hinzufügen der Medien');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Medien aus einem Erinnerungsraum löschen
  const deleteMedia = async (spaceId, mediaId) => {
    setIsLoading(true);
    setError(null);
    try {
      // In einer echten App: API-Aufruf
      // Hier: Simulierte Löschung
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setSpaces(prevSpaces => 
        prevSpaces.map(space => {
          if (space.id === spaceId) {
            return {
              ...space,
              media: space.media.filter(item => item.id !== mediaId),
              itemCount: space.itemCount - 1,
              updatedAt: new Date().toISOString()
            };
          }
          return space;
        })
      );
      
      if (currentSpace && currentSpace.id === spaceId) {
        setCurrentSpace(prev => ({
          ...prev,
          media: prev.media.filter(item => item.id !== mediaId),
          itemCount: prev.itemCount - 1,
          updatedAt: new Date().toISOString()
        }));
      }
      
      return true;
    } catch (err) {
      setError('Fehler beim Löschen der Medien');
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Medien in einem Erinnerungsraum aktualisieren
  const updateMedia = async (spaceId, mediaId, updates) => {
    setIsLoading(true);
    setError(null);
    try {
      // In einer echten App: API-Aufruf
      // Hier: Simulierte Aktualisierung
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setSpaces(prevSpaces => 
        prevSpaces.map(space => {
          if (space.id === spaceId) {
            return {
              ...space,
              media: space.media.map(item => 
                item.id === mediaId 
                  ? { ...item, ...updates } 
                  : item
              ),
              updatedAt: new Date().toISOString()
            };
          }
          return space;
        })
      );
      
      if (currentSpace && currentSpace.id === spaceId) {
        setCurrentSpace(prev => ({
          ...prev,
          media: prev.media.map(item => 
            item.id === mediaId 
              ? { ...item, ...updates } 
              : item
          ),
          updatedAt: new Date().toISOString()
        }));
      }
      
      return true;
    } catch (err) {
      setError('Fehler beim Aktualisieren der Medien');
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Automatisch alle Räume laden beim ersten Rendern
  useEffect(() => {
    loadSpaces();
  }, []);

  // Werte und Funktionen für den Context
  const contextValue = {
    spaces,
    currentSpace,
    isLoading,
    error,
    loadSpaces,
    loadSpace,
    createSpace,
    updateSpace,
    deleteSpace,
    addMedia,
    deleteMedia,
    updateMedia
  };

  return (
    <MemorySpaceContext.Provider value={contextValue}>
      {children}
    </MemorySpaceContext.Provider>
  );
};