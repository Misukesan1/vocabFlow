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
  toggleWordSelection,
  toggleAllWordsSelection,
} from '../../slices/listsSlice';
import { addToast } from '../../slices/toastSlice';

const ListDetailView = () => {
  const dispatch = useDispatch();
  const activeListId = useSelector((state) => state.lists.activeListId);
  const list = useSelector((state) =>
    state.lists.lists.find((l) => l.id === activeListId)
  );

  // Calcul du nombre de mots sélectionnés
  const selectedWordsCount = list?.words.filter(word => word.isSelected).length || 0;
  const totalWordsCount = list?.words.length || 0;
  const allSelected = selectedWordsCount === totalWordsCount && totalWordsCount > 0;

  const [isCreateWordModalOpen, setIsCreateWordModalOpen] = useState(false);
  const [isEditWordModalOpen, setIsEditWordModalOpen] = useState(false);
  const [isEditListModalOpen, setIsEditListModalOpen] = useState(false);
  const [isDeleteWordModalOpen, setIsDeleteWordModalOpen] = useState(false);
  const [isDeleteListModalOpen, setIsDeleteListModalOpen] = useState(false);
  const [isToggleAllModalOpen, setIsToggleAllModalOpen] = useState(false);
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
    dispatch(addToast({
      message: 'Mot ajouté avec succès',
      type: 'success'
    }));
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
    dispatch(addToast({
      message: 'Mot modifié avec succès',
      type: 'success'
    }));
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
      dispatch(addToast({
        message: 'Mot supprimé',
        type: 'info'
      }));
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
    dispatch(addToast({
      message: 'Liste renommée avec succès',
      type: 'success'
    }));
  };

  const handleDeleteList = () => {
    setIsDeleteListModalOpen(true);
  };

  const confirmDeleteList = () => {
    dispatch(deleteList(activeListId));
    dispatch(addToast({
      message: 'Liste supprimée',
      type: 'info'
    }));
  };

  const handleStartTraining = () => {
    dispatch(startTraining());
    dispatch(addToast({
      message: 'Entraînement commencé !',
      type: 'success'
    }));
  };

  const handleToggleWordSelection = (wordId) => {
    dispatch(toggleWordSelection({ listId: activeListId, wordId }));
  };

  const handleToggleAllWords = () => {
    // Ne pas montrer le modal si on désélectionne tout et qu'il n'y a aucun mot sélectionné
    // Ou si on sélectionne tout et que tous les mots sont déjà sélectionnés
    if ((allSelected && selectedWordsCount === 0) || (!allSelected && selectedWordsCount === totalWordsCount)) {
      return;
    }
    setIsToggleAllModalOpen(true);
  };

  const confirmToggleAllWords = () => {
    dispatch(toggleAllWordsSelection({
      listId: activeListId,
      selectAll: !allSelected
    }));
    dispatch(addToast({
      message: allSelected ? 'Tous les mots désélectionnés' : 'Tous les mots sélectionnés',
      type: 'info'
    }));
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
        {list.words.length > 0 && (
          <p className="text-xs text-purple-500 mt-1">
            {selectedWordsCount}/{totalWordsCount} mot{selectedWordsCount !== 1 ? 's' : ''} sélectionné{selectedWordsCount !== 1 ? 's' : ''}
          </p>
        )}
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
            disabled={selectedWordsCount === 0}
            className={`
              flex items-center justify-center gap-2 w-full px-4 py-3 mb-3
              rounded-xl transition-all
              ${selectedWordsCount === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white active:scale-95 hover:bg-green-700'
              }
            `}
          >
            <span className="text-sm font-medium">Commencer l'entraînement</span>
          </button>
        )}

        {list.words.length > 0 && (
          <button
            onClick={handleToggleAllWords}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 mb-3 bg-purple-100 text-purple-600 rounded-xl transition-all active:scale-95 hover:bg-purple-200"
          >
            <span className="text-sm font-medium">
              {allSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
            </span>
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
                onToggleSelection={() => handleToggleWordSelection(word.id)}
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

      <ConfirmModal
        isOpen={isToggleAllModalOpen}
        onClose={() => setIsToggleAllModalOpen(false)}
        onConfirm={confirmToggleAllWords}
        title={allSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
        message={
          allSelected
            ? 'Êtes-vous sûr de vouloir désélectionner tous les mots ?'
            : 'Êtes-vous sûr de vouloir sélectionner tous les mots ?'
        }
        confirmText={allSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
        cancelText="Annuler"
        variant="primary"
      />
    </div>
  );
};

export default ListDetailView;
