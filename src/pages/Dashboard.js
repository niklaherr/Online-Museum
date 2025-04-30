import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';

// Tremor-Komponenten importieren
import {
  Card,
  Title,
  Text,
  Metric,
  Flex,
  Badge,
  AreaChart,
  DonutChart,
  BarChart,
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Grid,
  Col,
  DateRangePicker,
  MultiSelect,
  MultiSelectItem,
  Button
} from '@tremor/react';

// Beispieldaten für Charts
const storageUsageData = [
  { category: 'Bilder', value: 1.2 },
  { category: 'Videos', value: 2.5 },
  { category: 'Audio', value: 0.8 },
  { category: 'Dokumente', value: 0.5 },
];

const activityData = [
  { date: '2023-01', uploads: 12, views: 45, comments: 8 },
  { date: '2023-02', uploads: 18, views: 62, comments: 15 },
  { date: '2023-03', uploads: 14, views: 55, comments: 12 },
  { date: '2023-04', uploads: 22, views: 85, comments: 24 },
  { date: '2023-05', uploads: 32, views: 105, comments: 31 },
  { date: '2023-06', uploads: 28, views: 95, comments: 22 },
  { date: '2023-07', uploads: 42, views: 130, comments: 36 },
];

const categoryData = [
  { category: 'Familientreffen', count: 24 },
  { category: 'Urlaube', count: 18 },
  { category: 'Jubiläen', count: 12 },
  { category: 'Alltagsmomente', count: 30 },
  { category: 'Historische Dokumente', count: 8 },
];

// Erinnerungsraum-Karte Komponente (überarbeitet mit Tremor)
const SpaceCard = ({ space, onView }) => {
  return (
    <Card decoration="top" decorationColor="blue" onClick={() => onView(space.id)} className="cursor-pointer">
      <div className="h-32 -mt-6 -mx-6 mb-4 bg-gray-200 relative">
        {space.coverImage ? (
          <img
            src={space.coverImage}
            alt={space.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500">
            <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge color={space.isPrivate ? "gray" : "blue"} size="sm">
            {space.isPrivate ? 'Privat' : 'Öffentlich'}
          </Badge>
        </div>
      </div>
      
      <Title>{space.title}</Title>
      
      <Flex className="mt-4">
        <Text>{space.itemCount} Einträge</Text>
        <Text>{new Date(space.updatedAt).toLocaleDateString('de-DE')}</Text>
      </Flex>
    </Card>
  );
};

// Aktivitäts-Element mit Tremor
const ActivityItem = ({ activity }) => {
  // Formatierung der Zeit als "vor x Minuten/Stunden/Tagen"
  const formatTime = (timeString) => {
    const now = new Date();
    const time = new Date(timeString);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) {
      return `vor ${diffMins} Minuten`;
    } else if (diffHours < 24) {
      return `vor ${diffHours} Stunden`;
    } else {
      return `vor ${diffDays} Tagen`;
    }
  };
  
  // Badge-Farbe basierend auf Aktivitätstyp
  const getBadgeColor = () => {
    switch(activity.type) {
      case 'upload': return 'emerald';
      case 'comment': return 'blue';
      case 'create': return 'purple';
      default: return 'gray';
    }
  };
  
  return (
    <Flex className="py-2">
      <div>
        <Badge color={getBadgeColor()} size="xs">
          {activity.type.toUpperCase()}
        </Badge>
        <Text className="mt-1">
          <span className="font-medium">{activity.user}</span> {activity.action} in <span className="font-medium">{activity.target}</span>
        </Text>
      </div>
      <Text>{formatTime(activity.time)}</Text>
    </Flex>
  );
};

// Hauptkomponente für das Dashboard
const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [recentSpaces, setRecentSpaces] = useState([
    {
      id: '1',
      title: 'Familienurlaub Italien 2022',
      itemCount: 42,
      coverImage: '/api/placeholder/400/200',
      updatedAt: '2022-06-15T12:00:00Z',
      isPrivate: false
    },
    {
      id: '2',
      title: 'Omas Kriegserinnerungen',
      itemCount: 18,
      coverImage: '/api/placeholder/400/200',
      updatedAt: '2023-01-10T09:30:00Z',
      isPrivate: true
    },
    {
      id: '3',
      title: 'Hochzeit von Marie & Thomas',
      itemCount: 87,
      coverImage: '/api/placeholder/400/200',
      updatedAt: '2023-09-05T16:45:00Z',
      isPrivate: false
    }
  ]);
  
  const [activities, setActivities] = useState([
    {
      id: 'act1',
      type: 'upload',
      user: 'Du',
      action: 'hast ein neues Foto hochgeladen',
      target: 'Familienurlaub Italien 2022',
      time: '2023-04-29T14:35:00Z'
    },
    {
      id: 'act2',
      type: 'comment',
      user: 'Anna',
      action: 'hat einen Kommentar hinterlassen',
      target: 'Omas Kriegserinnerungen',
      time: '2023-04-28T09:15:00Z'
    },
    {
      id: 'act3',
      type: 'create',
      user: 'Du',
      action: 'hast einen neuen Raum erstellt',
      target: 'Hochzeit von Marie & Thomas',
      time: '2023-04-25T16:20:00Z'
    }
  ]);

  const handleSpaceView = (id) => {
    // Navigation zur Erinnerungsraumansicht
    console.log('Navigiere zu Raum:', id);
  };

  return (
    <div className="space-y-6">
      <div>
        <Title>Dashboard</Title>
        <Text>Willkommen zurück, {user?.name || 'Gast'}!</Text>
      </div>
      
      {/* Statistik-Karten in einer Grid-Ansicht */}
      <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-6">
        <Card decoration="top" decorationColor="blue">
          <Flex alignItems="start">
            <div>
              <Text>Erinnerungsräume</Text>
              <Metric>12</Metric>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </Flex>
        </Card>
        
        <Card decoration="top" decorationColor="emerald">
          <Flex alignItems="start">
            <div>
              <Text>Medien</Text>
              <Metric>247</Metric>
            </div>
            <div className="bg-emerald-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </Flex>
        </Card>
        
        <Card decoration="top" decorationColor="purple">
          <Flex alignItems="start">
            <div>
              <Text>Speichernutzung</Text>
              <Metric>5.0 GB</Metric>
              <Text className="mt-2">1.4 GB von 5 GB genutzt</Text>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
            </div>
          </Flex>
        </Card>
      </Grid>
      
      {/* Abschnitt für detaillierte Analysen und Diagramme */}
      <TabGroup>
        <TabList>
          <Tab>Aktivitätsübersicht</Tab>
          <Tab>Speichernutzung</Tab>
          <Tab>Kategorien</Tab>
        </TabList>
        
        <TabPanels>
          <TabPanel>
            <Card>
              <Title>Aktivitäten über Zeit</Title>
              <Text>Anzahl der Uploads, Ansichten und Kommentare</Text>
              <AreaChart
                className="mt-4 h-72"
                data={activityData}
                index="date"
                categories={["uploads", "views", "comments"]}
                colors={["emerald", "blue", "amber"]}
                valueFormatter={(number) => `${number} Aktionen`}
              />
            </Card>
          </TabPanel>
          
          <TabPanel>
            <Card>
              <Title>Speichernutzung nach Medientyp</Title>
              <Text>Verteilung des belegten Speicherplatzes (in GB)</Text>
              <DonutChart
                className="mt-6 h-60"
                data={storageUsageData}
                category="value"
                index="category"
                colors={["blue", "cyan", "indigo", "violet"]}
                valueFormatter={(value) => `${value} GB`}
              />
            </Card>
          </TabPanel>
          
          <TabPanel>
            <Card>
              <Title>Inhalte nach Kategorie</Title>
              <Text>Anzahl der Einträge pro Kategorie</Text>
              <BarChart
                className="mt-4 h-60"
                data={categoryData}
                index="category"
                categories={["count"]}
                colors={["blue"]}
                valueFormatter={(value) => `${value} Einträge`}
              />
            </Card>
          </TabPanel>
        </TabPanels>
      </TabGroup>
      
      {/* Kürzlich bearbeitete Räume */}
      <div>
        <Flex justifyContent="between" alignItems="center">
          <Title>Kürzlich bearbeitet</Title>
          <Button size="xs" variant="light">Alle anzeigen</Button>
        </Flex>
        
        <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-6 mt-4">
          {recentSpaces.map(space => (
            <SpaceCard key={space.id} space={space} onView={handleSpaceView} />
          ))}
        </Grid>
      </div>
      
      {/* Schnellzugriff auf Funktionen */}
      <Grid numItems={2} numItemsSm={4} className="gap-4">
        <Card className="cursor-pointer hover:border-blue-200 text-center">
          <div className="mx-auto mb-2 bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <Text className="font-medium">Neuer Raum</Text>
        </Card>
        
        <Card className="cursor-pointer hover:border-emerald-200 text-center">
          <div className="mx-auto mb-2 bg-emerald-100 p-3 rounded-full w-12 h-12 flex items-center justify-center">
            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <Text className="font-medium">Medien hochladen</Text>
        </Card>
        
        <Card className="cursor-pointer hover:border-purple-200 text-center">
          <div className="mx-auto mb-2 bg-purple-100 p-3 rounded-full w-12 h-12 flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <Text className="font-medium">Stammbaum</Text>
        </Card>
        
        <Card className="cursor-pointer hover:border-amber-200 text-center">
          <div className="mx-auto mb-2 bg-amber-100 p-3 rounded-full w-12 h-12 flex items-center justify-center">
            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <Text className="font-medium">Notiz verfassen</Text>
        </Card>
      </Grid>
      
      {/* Aktivitäten */}
      <Card>
        <Flex justifyContent="between" alignItems="center">
          <Title>Aktivitäten</Title>
          <DateRangePicker
            className="max-w-md"
            enableDropdown={false}
            placeholder="Filter nach Datum"
          />
        </Flex>
        
        <div className="mt-4 divide-y divide-gray-200">
          {activities.map(activity => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <Button size="xs" variant="light">Alle Aktivitäten anzeigen</Button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;