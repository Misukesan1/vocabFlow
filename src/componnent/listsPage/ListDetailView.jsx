import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowLeft, Plus, Edit2, Trash2 } from 'lucide-react';
import WordCard from './WordCard';
import CreateWordModal from './CreateWordModal';
import EditWordModal from './EditWordModal';
import EditListModal from './EditListModal';
import ConfirmModal from '../ConfirmModal';
import {
  addWord,
  updateWord,
  deleteWord,
  updateList,
  deleteList,
  setActiveList,
  startTraining,
} from '../../slices/listsSlice';

const ListDetailView = () => {
  const dispatch = useDispatch();
  const activeListId = useSelector((state) => state.lists.activeListId);
  const list = useSelector((state) =>
    state.lists.lists.find((l) => l.id === activeListId)
  );

  const [isCreateWordModalOpen, setIsCreateWordModalOpen] = useState(false);
  const [isEditWordModalOpen, setIsEditWordModalOpen] = useState(false);
  const [isEditListModalOpen, setIsEditListModalOpen] = useState(false);
  const [isDeleteWordModalOpen, setIsDeleteWordModalOpen] = useState(false);
  const [isDeleteListModalOpen, setIsDeleteListModalOpen] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  const [wordToDelete, setWordToDelete] = useState(null);

  if (!list) {
    return null;
  }

  const handleBack = () => {
    dispatch(setActiveList(null));
  };

  const handleCreateWord = (wordData) => {
    dispatch(
      addWord({
        listId: activeListId,
        ...wordData,
      })
    );
  };

  const handleEditWord = (word) => {
    setSelectedWord(word);
    setIsEditWordModalOpen(true);
  };

  const handleUpdateWord = (wordData) => {
    dispatch(
      updateWord({
        listId: activeListId,
        wordId: selectedWord.id,
        ...wordData,
      })
    );
    setSelectedWord(null);
  };

  const handleDeleteWord = (wordId) => {
    setWordToDelete(wordId);
    setIsDeleteWordModalOpen(true);
  };

  const confirmDeleteWord = () => {
    if (wordToDelete) {
      dispatch(
        deleteWord({
          listId: activeListId,
          wordId: wordToDelete,
        })
      );
      setWordToDelete(null);
    }
  };

  const handleUpdateList = (newName) => {
    dispatch(
      updateList({
        id: activeListId,
        name: newName,
      })
    );
  };

  const handleDeleteList = () => {
    setIsDeleteListModalOpen(true);
  };

  const confirmDeleteList = () => {
    dispatch(deleteList(activeListId));
  };

  const handleStartTraining = () => {
    dispatch(startTraining());
  };

  return (
    <div className="flex flex-col h-full pb-20">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-purple-600 transition-all active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Retour</span>
          </button>
          <div className="flex gap-1">
            <button
              onClick={() => setIsEditListModalOpen(true)}
              className="p-2 rounded-lg transition-all active:scale-95 text-gray-400 hover:text-purple-600 hover:bg-purple-50"
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleDeleteList}
              className="p-2 rounded-lg transition-all active:scale-95 text-gray-400 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
        <h1 className="text-lg font-medium text-gray-700">{list.name}</h1>
        <p className="text-xs text-gray-400 mt-1">
          {list.words.length} mot{list.words.length !== 1 ? 's' : ''}
        </p>
        {list.trainingRounds > 0 && (
          <p className="text-xs text-purple-500 mt-1">
            {list.trainingRounds} tour{list.trainingRounds !== 1 ? 's' : ''} d'entraînement
          </p>
        )}
      </div>

      <div className="p-4">
        {list.words.length > 0 && (
          <button
            onClick={handleStartTraining}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 mb-3 bg-green-600 text-white rounded-xl transition-all active:scale-95 hover:bg-green-700"
          >
            <span className="text-sm font-medium">Commencer l'entraînement</span>
          </button>
        )}

        <button
          onClick={() => setIsCreateWordModalOpen(true)}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 mb-4 bg-purple-600 text-white rounded-xl transition-all active:scale-95 hover:bg-purple-700"
        >
          <Plus className="w-5 h-5" />
          <span className="text-sm font-medium">Ajouter un mot</span>
        </button>

        {list.words.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-gray-400 text-sm mb-2">
              Aucun mot dans cette liste
            </p>
            <p className="text-gray-400 text-xs">
              Commencez par ajouter votre premier mot !
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {list.words.map((word) => (
              <WordCard
                key={word.id}
                word={word}
                onEdit={() => handleEditWord(word)}
                onDelete={() => handleDeleteWord(word.id)}
              />
            ))}
          </div>
        )}
      </div>

      <CreateWordModal
        isOpen={isCreateWordModalOpen}
        onClose={() => setIsCreateWordModalOpen(false)}
        onCreateWord={handleCreateWord}
      />

      <EditWordModal
        isOpen={isEditWordModalOpen}
        onClose={() => {
          setIsEditWordModalOpen(false);
          setSelectedWord(null);
        }}
        onUpdateWord={handleUpdateWord}
        word={selectedWord}
      />

      <EditListModal
        isOpen={isEditListModalOpen}
        onClose={() => setIsEditListModalOpen(false)}
        onUpdateList={handleUpdateList}
        listName={list.name}
      />

      <ConfirmModal
        isOpen={isDeleteWordModalOpen}
        onClose={() => {
          setIsDeleteWordModalOpen(false);
          setWordToDelete(null);
        }}
        onConfirm={confirmDeleteWord}
        title="Supprimer le mot"
        message="Êtes-vous sûr de vouloir supprimer ce mot ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
      />

      <ConfirmModal
        isOpen={isDeleteListModalOpen}
        onClose={() => setIsDeleteListModalOpen(false)}
        onConfirm={confirmDeleteList}
        title="Supprimer la liste"
        message="Êtes-vous sûr de vouloir supprimer cette liste et tous ses mots ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
      />
    </div>
  );
};

export default ListDetailView;
