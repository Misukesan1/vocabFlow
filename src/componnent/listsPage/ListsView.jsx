import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus } from 'lucide-react';
import ListCard from './ListCard';
import CreateListModal from './CreateListModal';
import { createList, setActiveList } from '../../slices/listsSlice';
import { addToast } from '../../slices/toastSlice';

const ListsView = () => {
  const dispatch = useDispatch();
  const lists = useSelector((state) => state.lists.lists);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateList = (name) => {
    dispatch(createList({ name }));
    dispatch(addToast({
      message: `Liste "${name}" créée avec succès`,
      type: 'success'
    }));
  };

  const handleListClick = (listId) => {
    dispatch(setActiveList(listId));
  };

  return (
    <div className="flex flex-col h-full pb-20">
      <div className="p-4">
        <h1 className="text-lg text-center font-medium text-gray-700 mb-4">
          Mes Listes de Vocabulaire
        </h1>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 mb-4 bg-purple-600 text-white rounded-xl transition-all active:scale-95 hover:bg-purple-700"
        >
          <Plus className="w-5 h-5" />
          <span className="text-sm font-medium">Créer une nouvelle liste</span>
        </button>

        {lists.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-gray-400 text-sm mb-2">
              Aucune liste pour le moment
            </p>
            <p className="text-gray-400 text-xs">
              Créez votre première liste de vocabulaire !
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {lists.map((list) => (
              <ListCard
                key={list.id}
                list={list}
                onClick={() => handleListClick(list.id)}
              />
            ))}
          </div>
        )}
      </div>

      <CreateListModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateList={handleCreateList}
      />
    </div>
  );
};

export default ListsView;
