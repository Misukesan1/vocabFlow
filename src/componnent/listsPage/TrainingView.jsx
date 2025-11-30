import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowLeft } from 'lucide-react';
import { exitTraining, incrementTrainingRound } from '../../slices/listsSlice';

const TrainingView = () => {
  const dispatch = useDispatch();
  const activeListId = useSelector((state) => state.lists.activeListId);
  const list = useSelector((state) =>
    state.lists.lists.find((l) => l.id === activeListId)
  );

  const [shuffledWords, setShuffledWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [showRoundComplete, setShowRoundComplete] = useState(false);
  const [isRoundAnimating, setIsRoundAnimating] = useState(false);

  // Mélange les mots à chaque nouveau tour
  useEffect(() => {
    if (list && list.words.length > 0) {
      const shuffled = [...list.words].sort(() => Math.random() - 0.5);
      setShuffledWords(shuffled);
      setCurrentWordIndex(0);
      setIsRevealed(false);
    }
  }, [currentRound, list]);

  // Animation du compteur quand il change
  useEffect(() => {
    if (currentRound > 1) {
      setIsRoundAnimating(true);
      setTimeout(() => setIsRoundAnimating(false), 600);
    }
  }, [currentRound]);

  if (!list || shuffledWords.length === 0) {
    return null;
  }

  const currentWord = shuffledWords[currentWordIndex];

  const handleCardClick = () => {
    if (showRoundComplete) {
      // Clic sur message de fin → Nouveau tour
      setCurrentRound((prev) => prev + 1);
      dispatch(incrementTrainingRound(activeListId));
      setShowRoundComplete(false);
      return;
    }

    if (!isRevealed) {
      setIsRevealed(true);
    } else {
      // Dernier mot du tour
      if (currentWordIndex + 1 >= shuffledWords.length) {
        setShowRoundComplete(true);
      } else {
        setCurrentWordIndex((prev) => prev + 1);
        setIsRevealed(false);
      }
    }
  };

  const handleExitTraining = () => {
    dispatch(exitTraining());
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={handleExitTraining}
            className="flex items-center gap-2 text-purple-600 transition-all active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Retour</span>
          </button>
          <p
            className={`text-sm transition-all duration-300 ${
              isRoundAnimating
                ? 'text-green-500 font-bold scale-125 animate-bounce'
                : 'text-gray-500'
            }`}
          >
            Tour de liste : {currentRound}
          </p>
        </div>
      </div>

      {/* Training Card ou Message de fin */}
      {showRoundComplete ? (
        <div
          onClick={handleCardClick}
          className="flex-1 flex items-center justify-center p-4 cursor-pointer animate-fade-in"
        >
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800">
              Fin du tour {currentRound}
            </h2>
            <p className="text-sm text-gray-400 mt-4">Cliquez pour continuer</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-4">
          <div
            onClick={handleCardClick}
            className={`
              cursor-pointer p-8 rounded-2xl transition-all
              border-2 shadow-lg bg-white max-w-2xl
              ${
                !isRevealed
                  ? 'border-purple-300 hover:shadow-xl hover:scale-105 animate-pulse'
                  : 'border-green-300 hover:shadow-xl'
              }
            `}
          >
            {!isRevealed ? (
              <>
                <h1 className="text-6xl font-bold text-gray-800 text-center mb-4">
                  {currentWord.kanji}
                </h1>
                <p className="text-sm text-gray-400 text-center mt-6">
                  Cliquez pour révéler
                </p>
              </>
            ) : (
              <>
                <div className="space-y-4 text-center">
                  <h1 className="text-6xl font-bold text-gray-800">
                    {currentWord.kanji}
                  </h1>
                  <p className="text-2xl text-gray-500 mt-2">{currentWord.romaji}</p>
                  <p className="text-xl text-gray-600 mt-4">{currentWord.meaning}</p>
                </div>
                <p className="text-sm text-gray-400 text-center mt-6">
                  Cliquez pour continuer
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingView;
