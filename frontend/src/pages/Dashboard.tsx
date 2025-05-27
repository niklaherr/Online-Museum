// frontend/src/pages/Dashboard.tsx (Erweiterte Version mit redaktionellen Listen)
import { useContext, useEffect, useState } from 'react';

// Tremor-Komponenten importieren
import {
  Card,
  Title,
  Text,
  Metric,
  Flex,
  Badge,
  AreaChart,
  BarChart,
  Grid
} from '@tremor/react';
import { 
  SparklesIcon, 
  ClockIcon,
  UserIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { userService } from 'services/UserService';
import Activity from 'interfaces/Activity';
import Editorial from 'interfaces/Editorial';
import { itemService } from 'services/ItemService';
import { editorialService } from 'services/EditorialService';
import NotyfService from 'services/NotyfService';
import NoResults from '../components/helper/NoResults';
import DateCount from 'interfaces/DateCount';
import Loading from 'components/helper/Loading';

type ActivityItemProps = {
  activity: Activity
}

// Aktivitäts-Element mit Tremor
const ActivityItem = ({ activity } : ActivityItemProps) => {
  // Formatierung der Zeit als "vor x Minuten/Stunden/Tagen"
  const formatTime = (timeString: string) => {
    const now = new Date();
    const time = new Date(timeString);
    const diffMs = now.getTime() - time.getTime();
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
      case 'CREATE': return 'emerald';
      case 'UPDATE': return 'blue';
      case 'DELETE': return 'purple';
      default: return 'gray';
    }
  };

  const getMessage = () => {
    switch (activity.type) {
      case 'CREATE':
        return `Element with ID ${activity.element_id} has been created.`;
      case 'UPDATE':
        return `Element with ID ${activity.element_id} has been updated.`;
      case 'DELETE':
        return `Element with ID ${activity.element_id} has been deleted.`;
      default:
        return `Activity on element ID ${activity.element_id}.`;
    }
  };
  
  return (
    <Flex className="py-2">
      <div>
        <Badge color={getBadgeColor()} size="xs">
          {activity.category.toUpperCase()}
        </Badge>
        <Text className="mt-1">
          {getMessage()}
        </Text>
      </div>
      <Text>{formatTime(activity.entered_on)}</Text>
    </Flex>
  );
};

// Editorial-Listen Komponente für Dashboard
type EditorialItemProps = {
  editorial: Editorial;
  onNavigate: (route: string) => void;
}

const EditorialItem = ({ editorial, onNavigate }: EditorialItemProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Card 
      className="group p-6 hover:shadow-xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-0 shadow-lg hover:scale-105 transform" 
      onClick={() => onNavigate(`/editorial/${editorial.id}`)}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-md">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <Badge color="indigo" size="sm" className="ml-3 px-3 py-1">
              Redaktionell
            </Badge>
          </div>
          
          <ArrowRightIcon className="w-6 h-6 text-blue-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
        </div>
        
        <div className="flex-1">
          <Title className="text-xl mb-3 text-blue-900 group-hover:text-indigo-800 transition-colors duration-300 line-clamp-2 leading-tight">
            {editorial.title}
          </Title>
          
          {editorial.description && (
            <Text className="text-sm text-blue-700 mb-4 line-clamp-3 leading-relaxed">
              {editorial.description}
            </Text>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-blue-200">
          <div className="flex items-center text-xs text-blue-600">
            <ClockIcon className="w-4 h-4 mr-2" />
            <span className="font-medium">Erstellt am {formatDate(editorial.entered_on)}</span>
          </div>
          
          <div className="text-xs text-blue-500 group-hover:text-blue-700 transition-colors duration-300 font-medium">
            Jetzt ansehen →
          </div>
        </div>
      </div>
    </Card>
  );
};

// Hauptkomponente für das Dashboard
const Dashboard = () => {
  
  const [activities, setActivities] = useState<Activity[]>([]);
  const [editorialLists, setEditorialLists] = useState<Editorial[]>([]);
  const [itemListDateCount, setItemListDateCount] = useState<DateCount[]>([]);
  const [itemDataCount, setItemDataCount] = useState<DateCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Laden der Basis-Daten
        const [activitiesData, itemListData, itemData] = await Promise.all([
          itemService.fetchActivities(),
          itemService.fetchItemListDataCounting(),
          itemService.fetchItemDataCounting()
        ]);
        
        setActivities(activitiesData);
        setItemListDateCount(itemListData);
        setItemDataCount(itemData);

        // Redaktionelle Listen separat laden, wenn der Benutzer angemeldet ist
        if (userService.isLoggedIn()) {
          try {
            const editorialData = await editorialService.fetchEditorialLists();
            setEditorialLists(editorialData);
          } catch (editorialError) {
            console.log("Redaktionelle Listen konnten nicht geladen werden:", editorialError);
            // Fehler beim Laden der redaktionellen Listen ist nicht kritisch
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        let errorMessage = "Fehler beim Laden der Dashboard-Daten";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        NotyfService.showError(errorMessage);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleNavigate = (route: string) => {
    // Hier können Sie die Navigation implementieren
    // z.B. window.location.href = route oder Ihre Router-Navigation
    window.location.href = route;
  };

  if (isLoading) return <Loading />

  return (
    <div className="space-y-6">
      <div>
        <Title>Dashboard</Title>
        <Text>Willkommen zurück, {userService.getUserName() || 'Gast'}!</Text>
      </div>

      {/* Redaktionelle Listen Section */}
      {editorialLists.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 border-0 shadow-2xl overflow-hidden">
          <div className="relative p-8">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <SparklesIcon className="w-8 h-8 text-white" />
                  </div>
                  <div className="ml-4">
                    <Title className="text-2xl text-white font-bold">Redaktionelle Empfehlungen</Title>
                    <Text className="text-blue-100 mt-1">Von unserem Team kuratierte Sammlungen</Text>
                  </div>
                </div>
                <button 
                  className="text-white/80 hover:text-white text-sm font-medium hover:underline transition-colors duration-300 flex items-center"
                  onClick={() => handleNavigate('/item-list')}
                >
                  Alle anzeigen
                  <ArrowRightIcon className="w-4 h-4 ml-1" />
                </button>
              </div>
              
              <Grid numItemsSm={1} numItemsMd={2} numItemsLg={3} className="gap-6">
                {editorialLists.slice(0, 3).map((editorial) => (
                  <EditorialItem 
                    key={editorial.id} 
                    editorial={editorial}
                    onNavigate={handleNavigate}
                  />
                ))}
              </Grid>
              
              {editorialLists.length > 3 && (
                <div className="mt-8 text-center">
                  <button 
                    className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm hover:scale-105 transform"
                    onClick={() => handleNavigate('/item-list')}
                  >
                    Weitere {editorialLists.length - 3} redaktionelle Listen entdecken
                  </button>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Bestehende Charts */}
      <Card>
        <Title>Itemlisten über die Zeit</Title>
        <BarChart
          className="h-80"
          data={itemListDateCount}
          index="date"
          categories={['count']}
          colors={['blue']}
          showLegend={false}
          yAxisWidth={60}
        />
      </Card>

      <Card>
        <Title>Items über die Zeit</Title>
        <BarChart
          className="h-80"
          data={itemDataCount}
          index="date"
          categories={['count']}
          colors={['indigo']}
          yAxisWidth={60}
        />
      </Card>

      {/* Aktivitäten */}
      {activities.length == 0 ? (
        <NoResults/>
      ) : (
        <Card>
          <Title>Letzte Aktivitäten</Title>
          <div className="divide-y divide-gray-200">
            {activities.map(activity => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;