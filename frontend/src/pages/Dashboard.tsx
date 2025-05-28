// frontend/src/pages/Dashboard.tsx (Erweiterte Version mit redaktionellen Listen)
import { useEffect, useState } from 'react';

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
  ArrowRightIcon,
  ChartBarIcon,
  DocumentTextIcon,
  PhotoIcon,
  RectangleStackIcon,
  CalendarIcon,
  ArrowTrendingUpIcon
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

// Modern Activity Card Component
const ActivityItem = ({ activity } : ActivityItemProps) => {
  const formatTime = (timeString: string) => {
    const now = new Date();
    const time = new Date(timeString);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) {
      return `vor ${diffMins} Min.`;
    } else if (diffHours < 24) {
      return `vor ${diffHours} Std.`;
    } else {
      return `vor ${diffDays} Tag${diffDays === 1 ? '' : 'en'}`;
    }
  };
  
  const getBadgeColor = () => {
    switch(activity.type) {
      case 'CREATE': return 'emerald';
      case 'UPDATE': return 'blue';
      case 'DELETE': return 'red';
      default: return 'gray';
    }
  };

  const getIcon = () => {
    switch(activity.type) {
      case 'CREATE': return <SparklesIcon className="w-4 h-4" />;
      case 'UPDATE': return <DocumentTextIcon className="w-4 h-4" />;
      case 'DELETE': return <PhotoIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  const getMessage = () => {
    const baseMessage = activity.category === 'ITEM' ? 'Item' : 
                       activity.category === 'ITEM_LIST' ? 'Liste' : 'Element';
    
    switch (activity.type) {
      case 'CREATE':
        return `${baseMessage} erstellt`;
      case 'UPDATE':
        return `${baseMessage} bearbeitet`;
      case 'DELETE':
        return `${baseMessage} gelöscht`;
      default:
        return `${baseMessage} verändert`;
    }
  };
  
  return (
    <Card className="group hover:shadow-md transition-all duration-200 border-l-4 border-l-blue-500">
      <Flex className="py-3" justifyContent="between" alignItems="center">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg bg-${getBadgeColor()}-50`}>
            {getIcon()}
          </div>
          
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Badge color={getBadgeColor()} size="xs">
                {getMessage()}
              </Badge>
              <Text className="text-xs text-gray-500">
                ID: {activity.element_id}
              </Text>
            </div>
            <Text className="text-sm font-medium text-gray-700">
              {activity.category.toLowerCase().replace('_', ' ')} Aktivität
            </Text>
          </div>
        </div>
        
        <div className="text-right">
          <Text className="text-xs text-gray-500 flex items-center">
            <ClockIcon className="w-3 h-3 mr-1" />
            {formatTime(activity.entered_on)}
          </Text>
        </div>
      </Flex>
    </Card>
  );
};

// Editorial-Listen Komponente für Dashboard (behalten das coole Banner!)
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
        </div>
      </div>
    </Card>
  );
};

// Modern Stats Card Component
const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = "blue",
  trend 
}: {
  title: string;
  value: number | string;
  icon: any;
  color?: string;
  trend?: string;
}) => {
  return (
    <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br from-${color}-50 to-${color}-100 opacity-50`}></div>
      
      <div className="relative p-6">
        <div className="flex items-center justify-between">
          <div>
            <Text className={`text-${color}-600 text-sm font-medium mb-1`}>
              {title}
            </Text>
            <Metric className={`text-2xl font-bold text-${color}-800`}>
              {value}
            </Metric>
            {trend && (
              <div className="flex items-center mt-2">
                <ArrowTrendingUpIcon className={`w-4 h-4 text-${color}-500 mr-1`} />
                <Text className={`text-xs text-${color}-600`}>{trend}</Text>
              </div>
            )}
          </div>
          
          <div className={`p-3 bg-${color}-100 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-8 h-8 text-${color}-600`} />
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
    window.location.href = route;
  };

  if (isLoading) return <Loading />

  // Calculate stats
  const totalItems = itemDataCount.reduce((sum, item) => sum + item.count, 0);
  const totalLists = itemListDateCount.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="space-y-2">
        <Title className="text-3xl font-bold text-gray-900">
          Dashboard
        </Title>
        <Text className="text-lg text-gray-600">
          Willkommen zurück, {userService.getUserName() || 'Gast'}! 👋
        </Text>
      </div>

      {/* Stats Cards */}
      <Grid numItemsSm={1} numItemsMd={2} className="gap-6">
        <StatsCard
          title="Meine Listen"
          value={totalLists}
          icon={RectangleStackIcon}
          color="green"
          trend="Organisiert"
        />
        <StatsCard
          title="Meine Items"
          value={totalItems}
          icon={PhotoIcon}
          color="blue"
          trend="Aktiv erstellt"
        />
      </Grid>

      {/* Redaktionelle Listen Section (behält das coole Banner!) */}
      {editorialLists.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 border-0 shadow-2xl overflow-hidden">
          <div className="relative p-8">
            {/* Decorative background elements */}
            
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

      {/* Charts Section */}
      <Grid numItemsSm={1} numItemsMd={2} className="gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <RectangleStackIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <Title>Item-Listen Entwicklung</Title>
              <Text className="text-gray-600">Ihre Listen über die Zeit</Text>
            </div>
          </div>
          <BarChart
            className="h-80"
            data={itemListDateCount}
            index="date"
            categories={['count']}
            colors={['blue']}
            yAxisWidth={60}
          />
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg mr-3">
              <PhotoIcon className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <Title>Items Entwicklung</Title>
              <Text className="text-gray-600">Ihre Items über die Zeit</Text>
            </div>
          </div>
          <BarChart
            className="h-80"
            data={itemDataCount}
            index="date"
            categories={['count']}
            colors={['indigo']}
            yAxisWidth={60}
          />
        </Card>
      </Grid>

      {/* Activities Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <ClockIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <Title>Letzte Aktivitäten</Title>
              <Text className="text-gray-600">Ihre neuesten Aktionen im Überblick</Text>
            </div>
          </div>
        </div>
        
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <ClockIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <Title className="text-gray-500 mb-2">Noch keine Aktivitäten</Title>
            <Text className="text-gray-400">
              Erstellen Sie Items oder Listen, um Ihre Aktivitäten hier zu sehen.
            </Text>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map(activity => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <Card className="p-6 bg-gradient-to-r from-gray-50 to-blue-50">
        <Title className="mb-4">Schnellaktionen</Title>
        <Grid numItemsSm={2} numItemsMd={4} className="gap-4">
          <button 
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 group border border-gray-200"
            onClick={() => handleNavigate('/items/create')}
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3 group-hover:scale-110 transition-transform duration-200">
                <PhotoIcon className="w-5 h-5 text-blue-600" />
              </div>
              <Text className="font-medium">Neues Item</Text>
            </div>
          </button>
          
          <button 
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 group border border-gray-200"
            onClick={() => handleNavigate('/item-list/create')}
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3 group-hover:scale-110 transition-transform duration-200">
                <RectangleStackIcon className="w-5 h-5 text-green-600" />
              </div>
              <Text className="font-medium">Neue Liste</Text>
            </div>
          </button>
          
          <button 
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 group border border-gray-200"
            onClick={() => handleNavigate('/items')}
          >
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3 group-hover:scale-110 transition-transform duration-200">
                <ChartBarIcon className="w-5 h-5 text-purple-600" />
              </div>
              <Text className="font-medium">Galerie</Text>
            </div>
          </button>
          
          <button 
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 group border border-gray-200"
            onClick={() => handleNavigate('/item-list')}
          >
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg mr-3 group-hover:scale-110 transition-transform duration-200">
                <SparklesIcon className="w-5 h-5 text-indigo-600" />
              </div>
              <Text className="font-medium">Listen</Text>
            </div>
          </button>
        </Grid>
      </Card>
    </div>
  );
};

export default Dashboard;