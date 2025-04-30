import { useState, useEffect } from 'react';

// Medien-Tab-Komponente
const MediaTab = ({ activeTab, media }) => {
  if (!media || media.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">Keine Medien vorhanden</h3>
        <p className="mt-1 text-gray-500">
          Füge Bilder, Videos oder andere Medien hinzu, um den Erinnerungsraum zu gestalten.
        </p>
      </div>
    );
  }

  // Filter nach Medientyp basierend auf dem aktiven Tab
  const filteredMedia = activeTab === 'all' 
    ? media 
    : media.filter(item => item.type === activeTab);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredMedia.map(item => (
        <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          {item.type === 'image' && (
            <div className="relative h-48">
              <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
            </div>
          )}
          
          {item.type === 'video' && (
            <div className="relative h-48 bg-gray-100 flex items-center justify-center">
              <div className="flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          )}
          
          {item.type === 'audio' && (
            <div className="relative h-48 bg-blue-50 flex items-center justify-center">
              <div className="flex items-center justify-center">
                <svg className="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
            </div>
          )}
          
          {item.type === 'document' && (
            <div className="relative h-48 bg-gray-50 flex items-center justify-center">
              <div className="flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          )}
          
          <div className="p-3">
            <h4 className="font-medium text-gray-900 truncate">{item.title}</h4>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(item.date).toLocaleDateString('de-DE')} • {item.location || 'Kein Ort angegeben'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

// Hauptkomponente für die Ansicht eines Erinnerungsraums
const MemorySpaceView = ({ id }) => {
  const [space, setSpace] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'image', 'video', 'audio', 'document'

  // Simulierte Daten laden
  useEffect(() => {
    const loadSpaceData = async () => {
      // Simuliere API-Anfrage
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Beispieldaten für einen Erinnerungsraum
      const mockSpace = {
        id: id,
        title: 'Familienurlaub Italien 2022',
        description: 'Unsere Reise durch die Toskana und entlang der Amalfiküste - ein unvergessliches Abenteuer mit der ganzen Familie. Von Florenz über Siena bis nach Positano, wir haben die schönsten Orte Italiens erkundet und dabei unvergessliche Erinnerungen gesammelt.',
        coverImage: '/api/placeholder/1200/400',
        isPrivate: false,
        createdAt: '2022-06-15T12:00:00Z',
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
          },
          {
            id: 'm4',
            type: 'audio',
            title: 'Straßenmusiker in Siena',
            description: 'Ein lokaler Musiker spielt traditionelle toskanische Lieder',
            url: '/audio-placeholder',
            date: '2022-06-18T16:10:00Z',
            location: 'Siena, Italien'
          },
          {
            id: 'm5',
            type: 'document',
            title: 'Reisetagebuch',
            description: 'Handgeschriebene Notizen und Eindrücke',
            url: '/document-placeholder',
            date: '2022-06-30T09:00:00Z',
            location: 'Rom, Italien'
          }
        ]
      };
      
      setSpace(mockSpace);
      setIsLoading(false);
    };
    
    loadSpaceData();
  }, [id]);

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

  if (!space) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Erinnerungsraum nicht gefunden</h2>
        <p className="mt-2 text-gray-600">
          Der gesuchte Erinnerungsraum existiert nicht oder wurde gelöscht.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header mit Titelbild */}
      <div className="relative mb-6">
        <div className="h-48 md:h-64 bg-blue-100 rounded-lg overflow-hidden">
          {space.coverImage ? (
            <img 
              src={space.coverImage} 
              alt={space.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500">
              <svg className="w-20 h-20 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg"></div>
        </div>
        
        <div className="absolute bottom-4 left-4 md:left-6 right-4 md:right-6">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white shadow-sm">{space.title}</h1>
              <div className="mt-1 flex items-center text-white text-opacity-90 text-sm">
                <span>{space.category}</span>
                <span className="mx-2">•</span>
                <span>Erstellt am {new Date(space.createdAt).toLocaleDateString('de-DE')}</span>
                <span className="mx-2">•</span>
                <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full">
                  {space.isPrivate ? 'Privat' : 'Öffentlich'}
                </span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button className="bg-white text-gray-800 px-3 py-1 rounded-lg text-sm font-medium hover:bg-opacity-90">
                Bearbeiten
              </button>
              <button className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-700">
                + Hinzufügen
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Beschreibung */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-2">Über diesen Erinnerungsraum</h2>
        <p className="text-gray-700">{space.description}</p>
      </div>
      
      {/* Tabs für Medientypen */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === 'all'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Alle Medien
            </button>
            <button
              onClick={() => setActiveTab('image')}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === 'image'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Bilder
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === 'video'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Videos
            </button>
            <button
              onClick={() => setActiveTab('audio')}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === 'audio'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Audio
            </button>
            <button
              onClick={() => setActiveTab('document')}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === 'document'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Dokumente
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <MediaTab activeTab={activeTab} media={space.media} />
        </div>
      </div>
      
      {/* Aktionsleiste am unteren Rand */}
      <div className="sticky bottom-4 bg-white rounded-lg shadow-md p-3 flex justify-between items-center">
        <div className="flex space-x-4">
          <button className="flex items-center text-gray-700 hover:text-blue-600">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm">Zeitstrahl</span>
          </button>
          <button className="flex items-center text-gray-700 hover:text-blue-600">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm">Karte</span>
          </button>
        </div>
        
        <div>
          <button className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-700">
            Teilen
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemorySpaceView;