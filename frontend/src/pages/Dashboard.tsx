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
  Grid,
  DateRangePicker,
  Button
} from '@tremor/react';
import { userService } from 'services/UserService';
import Activity from 'interfaces/Activity';
import { itemService } from 'services/ItemService';
import NotyfService from 'services/NotyfService';

const activityData = [
  { date: '2023-01', uploads: 12, views: 45, comments: 8 },
  { date: '2023-02', uploads: 18, views: 62, comments: 15 },
  { date: '2023-03', uploads: 14, views: 55, comments: 12 },
  { date: '2023-04', uploads: 22, views: 85, comments: 24 },
  { date: '2023-05', uploads: 32, views: 105, comments: 31 },
  { date: '2023-06', uploads: 28, views: 95, comments: 22 },
  { date: '2023-07', uploads: 42, views: 130, comments: 36 },
];

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

    loadItemLists();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <Title>Dashboard</Title>
        <Text>Willkommen zurück, {userService.getUserName() || 'Gast'}!</Text>
      </div>
      <Card>
        <div className="mt-4 divide-y divide-gray-200">
          {activities.map(activity => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;