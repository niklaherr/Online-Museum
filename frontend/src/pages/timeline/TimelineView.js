import TimelineViewComponent from '../../components/timeline/TimelineView';
import { useParams } from 'react-router-dom';

// Wrapper-Komponente für die TimelineView
const TimelineView = () => {
  const { id } = useParams();
  
  return (
    <TimelineViewComponent spaceId={id} />
  );
};

export default TimelineView;