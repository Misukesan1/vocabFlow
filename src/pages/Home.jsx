import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BookOpen, Sparkles, Target, Zap } from 'lucide-react';
import { setTab } from '../slices/navBarSlice';
import ListCard from '../componnent/listsPage/ListCard';
import { setActiveList } from '../slices/listsSlice';
import { addToast } from '../slices/toastSlice';

export default function Home() {
  const dispatch = useDispatch();
  const lists = useSelector((state) => state.lists.lists);

  // Calculer les statistiques
  const totalWords = lists.reduce((sum, list) => sum + list.words.length, 0);

  // Trier les listes par date de modification (plus récentes en premier)
  const recentLists = [...lists]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const handleCreateList = () => {
    dispatch(setTab('lists'));
    dispatch(addToast({
      message: 'Navigation vers la création de liste',
      type: 'info'
    }));
  };

  const handleListClick = (listId) => {
    dispatch(setActiveList(listId));
    dispatch(setTab('lists'));
  };

  // État vide : aucune liste créée
  if (lists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-12 min-h-[calc(100vh-120px)]">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Bienvenue sur VocabFlow
          </h1>
          <p className="text-base text-gray-500 max-w-md">
            Créez vos listes de vocabulaire et mémorisez efficacement
          </p>
        </div>

        {/* Section explicative */}
        <div className="flex flex-col gap-4 mb-8 w-full max-w-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-700">Créez vos listes</p>
              <p className="text-xs text-gray-400">Organisez votre vocabulaire</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-700">Ajoutez vos mots</p>
              <p className="text-xs text-gray-400">Construisez votre base de connaissances</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-700">Mémorisez à votre rythme</p>
              <p className="text-xs text-gray-400">Progressez jour après jour</p>
            </div>
          </div>
        </div>

        {/* CTA principal */}
        <button
          onClick={handleCreateList}
          className="w-full max-w-sm bg-purple-600 text-white font-medium py-4 px-6 rounded-xl transition-all active:scale-95 hover:bg-purple-700"
        >
          Créer ma première liste
        </button>
      </div>
    );
  }

  // État actif : listes existantes
  return (
    <div className="flex flex-col gap-6 px-4 py-6">
      {/* Statistiques rapides */}
      <div className="flex gap-3">
        <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Listes</p>
          <p className="text-2xl font-bold text-purple-600">{lists.length}</p>
        </div>
        <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Mots</p>
          <p className="text-2xl font-bold text-purple-600">{totalWords}</p>
        </div>
      </div>

      {/* Mes dernières listes */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Mes dernières listes</h2>
        </div>

        <div className="flex flex-col gap-3">
          {recentLists.map((list) => (
            <ListCard
              key={list.id}
              list={list}
              onClick={() => handleListClick(list.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
