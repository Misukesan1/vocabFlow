import { BookOpen, PenTool, MessageCircle } from 'lucide-react';

const ListCard = ({ list, onClick }) => {
  const wordCount = list.words.length;
  const formattedDate = new Date(list.createdAt).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
  });

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'words': return BookOpen;
      case 'kanji': return PenTool;
      case 'verbs': return MessageCircle;
      default: return BookOpen;
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'words': return 'text-purple-600';
      case 'kanji': return 'text-blue-600';
      case 'verbs': return 'text-orange-600';
      default: return 'text-purple-600';
    }
  };

  const CategoryIcon = getCategoryIcon(list.category || 'words');
  const categoryColor = getCategoryColor(list.category || 'words');

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-start gap-2 p-4 bg-white border border-gray-200 rounded-xl transition-all active:scale-95 hover:border-purple-600 w-full text-left"
    >
      <div className="flex items-start gap-2 w-full">
        <h3 className="text-base font-medium text-gray-700 break-words flex-1">
          {list.name}
        </h3>
        <CategoryIcon className={`w-5 h-5 ${categoryColor} flex-shrink-0`} />
      </div>
      <div className="flex flex-col gap-1 text-xs text-gray-400">
        <span>{wordCount} mot{wordCount !== 1 ? 's' : ''}</span>
        <span>Modifié le {formattedDate}</span>
      </div>
    </button>
  );
};

export default ListCard;
