import { Edit2, Trash2 } from 'lucide-react';

const WordCard = ({ word, onEdit, onDelete, onToggleSelection, category = 'words' }) => {
  const handleCardClick = (e) => {
    // Ne pas toggle si on clique sur les boutons
    if (e.target.closest('button')) {
      return;
    }
    onToggleSelection();
  };

  const renderWordContent = () => {
    switch(category) {
      case 'words':
        return (
          <>
            <div className="text-base font-medium text-gray-700 mb-1">{word.kanji}</div>
            <div className="text-sm text-gray-500 mb-2">{word.romaji}</div>
            <div className="text-sm text-gray-600">{word.meaning}</div>
          </>
        );
      case 'kanji':
        return (
          <>
            <div className="text-base font-medium text-gray-700 mb-1">{word.kanji}</div>
            <div className="text-sm text-gray-500 mb-1">Kun: {word.kunReading || 'N/A'} <span className="font-bold">(ex : {word.kunExample || 'N/A'})</span></div>
            <div className="text-sm text-gray-500 mb-1">On: {word.onReading || 'N/A'} <span className="font-bold">(ex : {word.onExample || 'N/A'})</span></div>
            <div className="text-sm text-gray-600">{word.meaning}</div>
          </>
        );
      case 'verbs':
        return (
          <>
            <div className="text-base font-medium text-gray-700 mb-1">{word.infinitive}</div>
            <div className="text-sm text-gray-500 mb-1">En action: {word.progressive}</div>
            <div className="text-sm text-gray-500 mb-1">Poli: {word.politeForm}</div>
            <div className="text-sm text-gray-600">{word.meaning}</div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`
        flex flex-col gap-2 p-4 bg-white border rounded-xl cursor-pointer
        transition-all
        ${word.isSelected
          ? 'border-gray-300 opacity-100'
          : 'border-gray-100 opacity-50'
        }
      `}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {renderWordContent()}
        </div>
        <div className="flex gap-1 ml-2">
          <button
            onClick={onEdit}
            className="p-2 rounded-lg transition-all active:scale-95 text-gray-400 hover:text-purple-600 hover:bg-purple-50"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg transition-all active:scale-95 text-gray-400 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WordCard;
