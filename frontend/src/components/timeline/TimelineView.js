import { useState, useEffect } from 'react';
import {
  Card,
  Title,
  Text,
  Badge,
  Flex,
  Grid,
  Col,
  DateRangePicker,
  MultiSelect,
  MultiSelectItem,
  Select,
  SelectItem,
  Divider,
  Button,
  AreaChart,
  BarChart,
  Metric,
  List,
  ListItem,
  ProgressBar,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels
} from '@tremor/react';

// Beispieldaten für die Zeitverteilung
const timeDistributionData = [
  { month: 'Jan', count: 4 },
  { month: 'Feb', count: 7 },
  { month: 'Mär', count: 5 },
  { month: 'Apr', count: 12 },
  { month: 'Mai', count: 15 },
  { month: 'Jun', count: 8 },
  { month: 'Jul', count: 10 },
  { month: 'Aug', count: 18 },
  { month: 'Sep', count: 14 },
  { month: 'Okt', count: 9 },
  { month: 'Nov', count: 6 },
  { month: 'Dez', count: 10 },
];

// Zeitstrahl-Ereignis-Komponente mit Tremor
const TimelineEvent = ({ item, isLeft }) => {
  // Icon basierend auf Medientyp
  const getIcon = () => {
    switch(item.type) {
      case 'image':
        return (
          <div className="bg-blue-100 p-3 rounded-full">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        );
      case 'video':
        return (
          <div className="bg-emerald-100 p-3 rounded-full">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'audio':
        return (
          <div className="bg-amber-100 p-3 rounded-full">
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
        );
      case 'document':
        return (
          <div className="bg-purple-100 p-3 rounded-full">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        );
      case 'text':
        return (
          <div className="bg-gray-100 p-3 rounded-full">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 p-3 rounded-full">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  // Badge-Farbe basierend auf Medientyp
  const getBadgeColor = () => {
    switch(item.type) {
      case 'image': return 'blue';
      case 'video': return 'emerald';
      case 'audio': return 'amber';
      case 'document': return 'purple';
      case 'text': return 'gray';
      default: return 'gray';
    }
  };

  return (
    <div className={`flex ${isLeft ? 'flex-row' : 'flex-row-reverse'} mb-8`}>
      {/* Zeitanzeige auf der Seite */}
      <div className={`w-1/4 ${isLeft ? 'text-right pr-4' : 'text-left pl-4'}`}>
        <Text className="font-medium">
          {new Date(item.date).toLocaleDateString('de-DE')}
        </Text>
        <Text className="text-gray-500 text-xs">
          {new Date(item.date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </div>
      
      {/* Zeitstrahl-Linie und Marker */}
      <div className="relative flex items-center justify-center w-12">
        <div className="h-full w-px bg-blue-200 absolute"></div>
        <div className="w-3 h-3 rounded-full bg-blue-500 z-10"></div>
      </div>
      
      {/* Inhalt */}
      <div className={`w-3/4 ${isLeft ? 'pl-4' : 'pr-4'}`}>
        <Card decoration="top" decorationColor={getBadgeColor()}>
          <Flex alignItems="start">
            <div>
              <Title>{item.title}</Title>
              <Badge color={getBadgeColor()} size="xs" className="mt-1">
                {item.type.toUpperCase()}
              </Badge>
            </div>
            {getIcon()}
          </Flex>
          
          {/* Medienbild oder Inhalt */}
          {item.type === 'image' && (
            <div className="mt-3">
              <img 
                src={item.url} 
                alt={item.title} 
                className="w-full h-32 object-cover rounded"
              />
            </div>
          )}
          
          {item.type === 'video' && (
            <div className="mt-3 bg-gray-100 h-32 rounded flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}
          
          {item.type === 'audio' && (
            <div className="mt-3 bg-amber-50 h-12 rounded flex items-center justify-center">
              <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
          )}
          
          {item.type === 'document' && (
            <div className="mt-3 bg-purple-50 h-12 rounded flex items-center justify-center">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          )}
          
          <Text className="mt-3">{item.description}</Text>
          
          {/* Ort (falls vorhanden) */}
          {item.location && (
            <div className="mt-3">
              <Text className="text-gray-500 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {item.location}
              </Text>
            </div>
          )}
          
          {/* Aktionsschaltflächen */}
          <Flex className="mt-4 pt-3 border-t border-gray-100" justifyContent="end">
            <Button size="xs" variant="light" color={getBadgeColor()} icon={() => (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            )}>
              Bearbeiten
            </Button>
            <Button size="xs" variant="light" color="gray" icon={() => (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            )}>
              Teilen
            </Button>
          </Flex>
        </Card>
      </div>
    </div>
  );
};

// Hauptkomponente für die Zeitstrahl-Ansicht mit Tremor
const TimelineView = ({ spaceId }) => {
  const [timelineItems, setTimelineItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState(['image', 'video', 'audio', 'document', 'text']);
  const [dateRange, setDateRange] = useState({ 
    from: new Date('2022-01-01'),
    to: new Date()
  });
  const [spaceInfo, setSpaceInfo] = useState(null);
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline', 'map', 'calendar'

  // Daten laden
  useEffect(() => {
    const loadTimelineData = async () => {
      setIsLoading(true);
      try {
        // Simulierte API-Anfrage
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock-Daten für den Zeitstrahl
        const mockSpaceInfo = {
          id: spaceId || '1',
          title: 'Familienurlaub Italien 2022',
          description: 'Unsere Reise durch die Toskana und entlang der Amalfiküste.',
          coverImage: '/api/placeholder/800/200'
        };
        
        const mockItems = [
          {
            id: 'item1',
            type: 'image',
            title: 'Ankunft in Florenz',
            description: 'Unser erster Tag in der Toskana mit Besichtigung des Doms.',
            url: '/api/placeholder/800/600',
            date: '2022-06-16T10:30:00Z',
            location: 'Florenz, Italien'
          },
          {
            id: 'item2',
            type: 'text',
            title: 'Tagebucheintrag',
            description: 'Heute haben wir die Uffizien besucht und waren beeindruckt von den Kunstwerken der Renaissance.',
            date: '2022-06-17T19:45:00Z',
            location: 'Florenz, Italien'
          },
          {
            id: 'item3',
            type: 'image',
            title: 'Siena Panorama',
            description: 'Blick über die mittelalterliche Stadt vom Torre del Mangia.',
            url: '/api/placeholder/800/600',
            date: '2022-06-18T12:15:00Z',
            location: 'Siena, Italien'
          },
          {
            id: 'item4',
            type: 'audio',
            title: 'Straßenmusiker',
            description: 'Ein lokaler Musiker spielt traditionelle toskanische Lieder in Siena.',
            url: '/audio-placeholder',
            date: '2022-06-18T16:10:00Z',
            location: 'Siena, Italien'
          },
          {
            id: 'item5',
            type: 'image',
            title: 'Weingut Chianti',
            description: 'Weinprobe und Abendessen auf einem Weingut in der Chianti-Region.',
            url: '/api/placeholder/800/600',
            date: '2022-06-19T18:30:00Z',
            location: 'Chianti, Italien'
          },
          {
            id: 'item6',
            type: 'video',
            title: 'Fahrt entlang der Amalfiküste',
            description: 'Die atemberaubende Küstenstraße mit ihren Kurven und Aussichtspunkten.',
            url: '/video-placeholder',
            date: '2022-06-21T11:20:00Z',
            location: 'Amalfiküste, Italien'
          },
          {
            id: 'item7',
            type: 'image',
            title: 'Sonnenuntergang in Positano',
            description: 'Ein traumhafter Abend mit Blick auf das Meer.',
            url: '/api/placeholder/800/600',
            date: '2022-06-22T19:45:00Z',
            location: 'Positano, Italien'
          },
          {
            id: 'item8',
            type: 'document',
            title: 'Reisetagebuch',
            description: 'Alle Notizen und Eindrücke unserer Reise.',
            url: '/document-placeholder',
            date: '2022-06-30T09:00:00Z',
            location: 'Rom, Italien'
          }
        ];
        
        setSpaceInfo(mockSpaceInfo);
        setTimelineItems(mockItems);
      } catch (error) {
        console.error('Fehler beim Laden der Zeitstrahl-Daten:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTimelineData();
  }, [spaceId]);

  // Verarbeiten des Datumbereichs
  const handleDateRangeChange = (range) => {
    setDateRange(range);
  };

  // Filtern der Zeitstrahl-Einträge
  const filteredItems = timelineItems.filter(item => {
    // Filtern nach Medientyp
    if (!activeFilters.includes(item.type)) return false;
    
    // Filtern nach Datumsbereich
    const itemDate = new Date(item.date);
    
    return itemDate >= dateRange.from && itemDate <= dateRange.to;
  });
  
  // Sortieren nach Datum (neueste zuerst)
  const sortedItems = [...filteredItems].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  // Medientypen für die Filteroption
  const mediaTypes = [
    { id: 'image', name: 'Bilder', icon: '📷' },
    { id: 'video', name: 'Videos', icon: '🎥' },
    { id: 'audio', name: 'Audio', icon: '🎵' },
    { id: 'document', name: 'Dokumente', icon: '📄' },
    { id: 'text', name: 'Texteinträge', icon: '✏️' }
  ];

  // Medientyp-Anzahl für Statistiken
  const typeCount = {
    image: timelineItems.filter(item => item.type === 'image').length,
    video: timelineItems.filter(item => item.type === 'video').length,
    audio: timelineItems.filter(item => item.type === 'audio').length,
    document: timelineItems.filter(item => item.type === 'document').length,
    text: timelineItems.filter(item => item.type === 'text').length,
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
      {/* Header mit Titelbild */}
      {spaceInfo && (
        <Card className="p-0 overflow-hidden">
          <div className="relative h-40">
            {spaceInfo.coverImage ? (
              <img 
                src={spaceInfo.coverImage} 
                alt={spaceInfo.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500">
                <svg className="w-16 h-16 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            
            <div className="absolute bottom-4 left-4 right-4">
              <Title className="text-white">Zeitstrahl: {spaceInfo.title}</Title>
              <Text className="text-white/80">{spaceInfo.description}</Text>
            </div>
          </div>
        </Card>
      )}

      {/* Ansichtsumschalter */}
      <TabGroup index={viewMode === 'timeline' ? 0 : viewMode === 'map' ? 1 : 2}>
        <TabList variant="solid">
          <Tab icon={() => (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18M5 18h14M8 6h8" />
            </svg>
          )} onClick={() => setViewMode('timeline')}>
            Zeitstrahl
          </Tab>
          <Tab icon={() => (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          )} onClick={() => setViewMode('map')}>
            Karte
          </Tab>
          <Tab icon={() => (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )} onClick={() => setViewMode('calendar')}>
            Kalender
          </Tab>
        </TabList>
      </TabGroup>

      {/* Hauptbereich mit Filter und Inhalt */}
      <Grid numItems={1} numItemsLg={3} className="gap-6">
        {/* Seitenleiste mit Filtern */}
        <Col numColSpan={1}>
          <div className="space-y-6">
            {/* Filter-Karte */}
            <Card>
              <Title>Filter</Title>
              
              <Divider />
              
              <div className="space-y-4">
                <div>
                  <Text className="mb-2">Zeitraum</Text>
                  <DateRangePicker
                    className="mt-2"
                    value={dateRange}
                    onValueChange={handleDateRangeChange}
                    selectPlaceholder="Auswählen"
                    color="blue"
                  />
                </div>
                
                <div>
                  <Text className="mb-2">Medientypen</Text>
                  <MultiSelect
                    className="max-w-full"
                    onValueChange={setActiveFilters}
                    placeholder="Filter auswählen"
                    value={activeFilters}
                  >
                    {mediaTypes.map((type) => (
                      <MultiSelectItem key={type.id} value={type.id}>
                        {type.icon} {type.name}
                      </MultiSelectItem>
                    ))}
                  </MultiSelect>
                </div>
              </div>
            </Card>
            
            {/* Statistik-Karte */}
            <Card>
              <Title>Übersicht</Title>
              
              <BarChart
                className="mt-4 h-40"
                data={[
                  { name: 'Bilder', wert: typeCount.image },
                  { name: 'Videos', wert: typeCount.video },
                  { name: 'Audio', wert: typeCount.audio },
                  { name: 'Dokumente', wert: typeCount.document },
                  { name: 'Text', wert: typeCount.text },
                ]}
                index="name"
                categories={['wert']}
                colors={['blue']}
                valueFormatter={(value) => `${value}`}
                layout="vertical"
                showLegend={false}
              />
              
              <List className="mt-4">
                <ListItem>
                  <div className="flex justify-between w-full">
                    <Text>Gesamtanzahl</Text>
                    <Text className="font-medium">{timelineItems.length}</Text>
                  </div>
                </ListItem>
                <ListItem>
                  <div className="flex justify-between w-full">
                    <Text>Zeitraum</Text>
                    <Text className="font-medium">
                      {timelineItems.length > 0 ? (
                        `${new Date(
                          Math.min(...timelineItems.map(item => new Date(item.date).getTime()))
                        ).toLocaleDateString('de-DE')} - ${new Date(
                          Math.max(...timelineItems.map(item => new Date(item.date).getTime()))
                        ).toLocaleDateString('de-DE')}`
                      ) : 'Keine Daten'}
                    </Text>
                  </div>
                </ListItem>
                <ListItem>
                  <div className="flex justify-between w-full">
                    <Text>Orte</Text>
                    <Text className="font-medium">
                      {[...new Set(timelineItems.map(item => item.location))].length}
                    </Text>
                  </div>
                </ListItem>
              </List>
            </Card>
            
            {/* Zeitverteilung */}
            <Card>
              <Title>Zeitliche Verteilung</Title>
              <AreaChart
                className="mt-4 h-40"
                data={timeDistributionData}
                index="month"
                categories={["count"]}
                colors={["blue"]}
                valueFormatter={(value) => `${value} Einträge`}
                showLegend={false}
              />
            </Card>
            
            {/* Aktionsschaltflächen */}
            <Card>
              <Button size="sm" color="blue" className="w-full" icon={()=> (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              )}>
                Neuen Eintrag erstellen
              </Button>
              
              <Flex className="mt-2" justifyContent="between">
                <Button size="sm" variant="secondary" icon={()=> (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}>
                  Exportieren
                </Button>
                <Button size="sm" variant="secondary" icon={()=> (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                )}>
                  Teilen
                </Button>
              </Flex>
            </Card>
          </div>
        </Col>

        {/* Hauptbereich mit Zeitstrahl */}
        <Col numColSpan={1} numColSpanLg={2}>
          {/* Ansichtswechsel */}
          <TabGroup>
            <TabPanels>
              <TabPanel>
                {/* Zeitstrahl-Ansicht */}
                {filteredItems.length === 0 ? (
                  <Card className="text-center py-8">
                    <div className="mx-auto bg-gray-100 rounded-full p-6 w-16 h-16 flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <Title>Keine Einträge gefunden</Title>
                    <Text className="mt-2">
                      Passe deine Filter an oder füge neue Einträge hinzu.
                    </Text>
                    <div className="mt-6">
                      <Button size="sm" color="blue" icon={()=> (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      )}>
                        Neuen Eintrag erstellen
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <div className="relative py-4">
                    {/* Zentrale Linie des Zeitstrahls */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-blue-200"></div>
                    
                    {/* Zeitstrahl-Einträge */}
                    <div className="relative z-10">
                      {sortedItems.map((item, index) => (
                        <TimelineEvent 
                          key={item.id} 
                          item={item} 
                          isLeft={index % 2 === 0} 
                        />
                      ))}
                    </div>
                  </div>
                )}
              </TabPanel>
              
              <TabPanel>
                {/* Karten-Ansicht (Platzhalter) */}
                <Card className="text-center py-8">
                  <div className="mx-auto bg-blue-100 rounded-full p-6 w-16 h-16 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <Title>Kartenansicht</Title>
                  <Text className="mt-2">
                    Hier würde eine interaktive Karte mit allen Orten angezeigt werden.
                  </Text>
                  <Text className="mt-1 text-gray-500">
                    In einer vollständigen Implementierung könnte Google Maps oder OpenStreetMap integriert werden.
                  </Text>
                </Card>
              </TabPanel>
              
              <TabPanel>
                {/* Kalender-Ansicht (Platzhalter) */}
                <Card className="text-center py-8">
                  <div className="mx-auto bg-amber-100 rounded-full p-6 w-16 h-16 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <Title>Kalenderansicht</Title>
                  <Text className="mt-2">
                    Hier würde ein Monatskalender mit markierten Ereignistagen angezeigt werden.
                  </Text>
                  <Text className="mt-1 text-gray-500">
                    Diese Ansicht ermöglicht die einfache Navigation nach Datum.
                  </Text>
                </Card>
              </TabPanel>
            </TabPanels>
          </TabGroup>
          
          {/* Fixed Action Button für neue Einträge (nur auf Mobilgeräten sichtbar) */}
          <div className="fixed bottom-6 right-6 lg:hidden">
            <Button size="lg" color="blue" icon={()=> (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            )} iconPosition="center" />
          </div>
        </Col>
      </Grid>
    </div>
  );
};

export default TimelineView;