import { useContext, useEffect, useState } from 'react';
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
  BarChart
} from '@tremor/react';
import { userService } from 'services/UserService';
import Activity from 'interfaces/Activity';
import { itemService } from 'services/ItemService';
import NotyfService from 'services/NotyfService';
import NoResults from './NoResults';
import DateCount from 'interfaces/DateCount';



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
          <span className="font-medium">{activity.username}</span> {activity.action} in <span className="font-medium">{activity.target}</span>
        </Text>
      </div>
      <Text>{formatTime(activity.entered_on)}</Text>
    </Flex>
  );
};

// Hauptkomponente für das Dashboard
const Dashboard = () => {
  
  const [activities, setActivities] = useState<Activity[]>([]);
  const [itemListDateCount, setItemListDateCount] = useState<DateCount[]>([]);
  const [itemDataCount, setItemDataCount] = useState<DateCount[]>([]);

  useEffect(() => {
    const loadItemLists = async () => {
      try {
        const activities = await itemService.fetchActivities();
        setActivities(activities)
        //setIsLoading(false)
      } catch (error) {
        let errorMessage = "Fehler beim Laden"
        if(error instanceof Error) {
          errorMessage = error.message
        }
        NotyfService.showError(errorMessage)
        userService.logout()
      }
    };

    const loadDataCount = async () => {
      try {
        const dateCount = await itemService.fetchItemListDataCounting();
        setItemListDateCount(dateCount)
        const itemDataCount = await itemService.fetchItemDataCounting();
        setItemDataCount(itemDataCount)
        //setIsLoading(false)
      } catch (error) {
        let errorMessage = "Fehler beim Laden"
        if(error instanceof Error) {
          errorMessage = error.message
        }
        NotyfService.showError(errorMessage)
      }
    };

    loadDataCount();

    loadItemLists();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <Title>Dashboard</Title>
        <Text>Willkommen zurück, {userService.getUserName() || 'Gast'}!</Text>
      </div>
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