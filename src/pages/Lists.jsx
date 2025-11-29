import { useSelector } from 'react-redux';
import ListsView from '../componnent/listsPage/ListsView';
import ListDetailView from '../componnent/listsPage/ListDetailView';

export default function Lists() {
  const activeListId = useSelector((state) => state.lists.activeListId);

  return (
    <div className="h-full">
      {activeListId ? <ListDetailView /> : <ListsView />}
    </div>
  );
}
