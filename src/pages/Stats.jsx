import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  BarChart3,
  ListChecks,
  BookOpen,
  Target,
  Trophy,
  Calendar,
  CheckCircle,
  Circle
} from 'lucide-react';
import { setTab } from '../slices/navBarSlice';

// Helper Functions
const formatDate = (isoString) => {
  return new Date(isoString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
  });
};

const truncateText = (text, maxLength = 20) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Sub-Components
const HorizontalBar = ({ label, value, maxValue }) => {
  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-700 truncate max-w-[200px]">{label}</span>
        <span className="text-gray-500 font-medium">{value}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className="bg-purple-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const DonutChart = ({ selected, unselected }) => {
  const total = selected + unselected;
  const selectedPercent = total > 0 ? (selected / total) * 100 : 0;

  return (
    <div className="flex items-center justify-center gap-8">
      <div
        className="w-32 h-32 rounded-full flex items-center justify-center"
        style={{
          background: `conic-gradient(
            #6366f1 0% ${selectedPercent}%,
            #e5e7eb ${selectedPercent}% 100%
          )`
        }}
      >
        <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center flex-col">
          <p className="text-2xl font-bold text-purple-600">{selectedPercent.toFixed(0)}%</p>
          <p className="text-xs text-gray-400">Sélectionnés</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-purple-600 fill-purple-600" />
          <span className="text-sm text-gray-600">{selected} sélectionnés</span>
        </div>
        <div className="flex items-center gap-2">
          <Circle className="w-4 h-4 text-gray-300 fill-gray-300" />
          <span className="text-sm text-gray-600">{unselected} non sélectionnés</span>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function Stats() {
  const dispatch = useDispatch();
  const lists = useSelector((state) => state.lists.lists);

  // Empty State
  if (lists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-12 min-h-[calc(100vh-120px)]">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <BarChart3 className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Aucune statistique disponible
          </h1>
          <p className="text-base text-gray-500 max-w-md">
            Créez vos premières listes pour voir vos statistiques apparaître ici
          </p>
        </div>
        <button
          onClick={() => dispatch(setTab('lists'))}
          className="w-full max-w-sm bg-purple-600 text-white font-medium py-4 px-6 rounded-xl transition-all active:scale-95 hover:bg-purple-700"
        >
          Créer ma première liste
        </button>
      </div>
    );
  }

  // Calculations
  const totalLists = lists.length;
  const totalWords = lists.reduce((sum, list) => sum + list.words.length, 0);
  const totalTrainingRounds = lists.reduce((sum, list) => sum + list.trainingRounds, 0);

  // Most trained list
  const mostTrainedList = lists.reduce((max, list) =>
    list.trainingRounds > max.trainingRounds ? list : max, lists[0]
  );

  // Last activity
  const lastActivityList = lists.reduce((latest, list) =>
    new Date(list.createdAt) > new Date(latest.createdAt) ? list : latest, lists[0]
  );

  // Selected vs unselected words
  const selectedWordsCount = lists.reduce((sum, list) =>
    sum + list.words.filter(word => word.isSelected).length, 0
  );
  const unselectedWordsCount = totalWords - selectedWordsCount;

  // Sorted lists by date (most recent first)
  const sortedByDate = [...lists].sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Data for charts
  const maxWords = Math.max(...lists.map(l => l.words.length), 0);
  const maxRounds = Math.max(...lists.map(l => l.trainingRounds), 0);

  // Active State
  return (
    <div className="flex flex-col gap-6 px-4 py-6">
      {/* Metrics Cards Grid */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <ListChecks className="w-4 h-4 text-purple-600" />
              <p className="text-xs text-gray-400">Listes</p>
            </div>
            <p className="text-2xl font-bold text-purple-600">{totalLists}</p>
          </div>
          <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-4 h-4 text-purple-600" />
              <p className="text-xs text-gray-400">Mots</p>
            </div>
            <p className="text-2xl font-bold text-purple-600">{totalWords}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-purple-600" />
              <p className="text-xs text-gray-400">Tours d'entraînement</p>
            </div>
            <p className="text-2xl font-bold text-purple-600">{totalTrainingRounds}</p>
          </div>
          <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-4 h-4 text-purple-600" />
              <p className="text-xs text-gray-400">Liste la plus entraînée</p>
            </div>
            {mostTrainedList.trainingRounds > 0 ? (
              <>
                <p className="text-sm font-bold text-purple-600 truncate">{truncateText(mostTrainedList.name, 15)}</p>
                <p className="text-xs text-gray-400">{mostTrainedList.trainingRounds} tours</p>
              </>
            ) : (
              <>
                <p className="text-sm font-bold text-gray-400">Aucune</p>
                <p className="text-xs text-gray-400">Commencez à vous entraîner !</p>
              </>
            )}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-purple-600" />
            <p className="text-xs text-gray-400">Dernière activité</p>
          </div>
          <p className="text-sm font-bold text-purple-600 truncate">{truncateText(lastActivityList.name, 30)}</p>
          <p className="text-xs text-gray-400">{formatDate(lastActivityList.createdAt)}</p>
        </div>
      </div>

      {/* Words per List Chart */}
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-gray-800">Mots par liste</h2>
        {totalWords > 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-4 max-h-[400px] overflow-y-auto scroll-smooth">
            <div className="flex flex-col gap-3">
              {sortedByDate.map((list) => (
                <HorizontalBar
                  key={list.id}
                  label={truncateText(list.name)}
                  value={list.words.length}
                  maxValue={maxWords}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-400">Aucun mot dans vos listes</p>
          </div>
        )}
      </div>

      {/* Training Rounds per List Chart */}
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-gray-800">Tours d'entraînement par liste</h2>
        {totalTrainingRounds > 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-4 max-h-[400px] overflow-y-auto scroll-smooth">
            <div className="flex flex-col gap-3">
              {sortedByDate.map((list) => (
                <HorizontalBar
                  key={list.id}
                  label={truncateText(list.name)}
                  value={list.trainingRounds}
                  maxValue={maxRounds}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-400">Commencez votre premier entraînement !</p>
          </div>
        )}
      </div>

      {/* Selected vs Unselected Donut Chart */}
      {totalWords > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-gray-800">Répartition des mots</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <DonutChart selected={selectedWordsCount} unselected={unselectedWordsCount} />
          </div>
        </div>
      )}
    </div>
  );
}
