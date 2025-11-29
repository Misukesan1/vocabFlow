import { BookOpen } from 'lucide-react';

const ListCard = ({ list, onClick }) => {
  const wordCount = list.words.length;
  const formattedDate = new Date(list.createdAt).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
  });

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-start gap-2 p-4 bg-white border border-gray-200 rounded-xl transition-all active:scale-95 hover:border-purple-600 w-full text-left"
    >
      <div className="flex items-start gap-2 w-full">
        <BookOpen className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
        <h3 className="text-base font-medium text-gray-700 break-words">
          {list.name}
        </h3>
      </div>
      <div className="flex flex-col gap-1 text-xs text-gray-400">
        <span>{wordCount} mot{wordCount !== 1 ? 's' : ''}</span>
        <span>Modifié le {formattedDate}</span>
      </div>
    </button>
  );
};

export default ListCard;
