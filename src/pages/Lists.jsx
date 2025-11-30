import { useSelector } from 'react-redux';
import ListsView from '../componnent/listsPage/ListsView';
import ListDetailView from '../componnent/listsPage/ListDetailView';
import TrainingView from '../componnent/listsPage/TrainingView';

export default function Lists() {
  const activeListId = useSelector((state) => state.lists.activeListId);
  const isTrainingMode = useSelector((state) => state.lists.isTrainingMode);

  return (
    <div className="h-full">
      {activeListId && isTrainingMode ? (
        <TrainingView />
      ) : activeListId ? (
        <ListDetailView />
      ) : (
        <ListsView />
      )}
    </div>
  );
}
