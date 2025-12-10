import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { exitTraining, incrementTrainingRound, toggleWordSelection, setCardInversionMode } from '../../slices/listsSlice';
import { addToast } from '../../slices/toastSlice';

const TrainingView = () => {
  const dispatch = useDispatch();
  const activeListId = useSelector((state) => state.lists.activeListId);
  const list = useSelector((state) =>
    state.lists.lists.find((l) => l.id === activeListId)
  );
  const isFaceInverted = useSelector((state) => state.lists.cardInversionMode);

  const [shuffledWords, setShuffledWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [showRoundComplete, setShowRoundComplete] = useState(false);
  const [isRoundAnimating, setIsRoundAnimating] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [initialWordCount, setInitialWordCount] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isToggleChanging, setIsToggleChanging] = useState(false);

  // Mélange les mots à chaque nouveau tour
  useEffect(() => {
    if (list && list.words.length > 0) {
      // Filtrer uniquement les mots sélectionnés
      const selectedWords = list.words.filter(word => word.isSelected);
      const shuffled = [...selectedWords].sort(() => Math.random() - 0.5);
      setShuffledWords(shuffled);
      setInitialWordCount(shuffled.length);
      setCurrentWordIndex(0);
      setIsRevealed(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRound]);

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
      dispatch(addToast({
        message: `Tour ${currentRound + 1} commencé !`,
        type: 'success'
      }));
      setShowRoundComplete(false);
      return;
    }

    if (!isRevealed) {
      setIsFlipping(true);
      setTimeout(() => {
        setIsRevealed(true);
        setIsFlipping(false);
      }, 200); // Moitié de l'animation (400ms total)
    } else {
      // Dernier mot du tour
      if (currentWordIndex + 1 >= shuffledWords.length) {
        setShowRoundComplete(true);
        dispatch(addToast({
          message: `Tour ${currentRound} terminé !`,
          type: 'success'
        }));
      } else {
        setCurrentWordIndex((prev) => prev + 1);
        setIsRevealed(false);
      }
    }
  };

  const handleExitTraining = () => {
    dispatch(exitTraining());
    dispatch(addToast({
      message: 'Entraînement terminé',
      type: 'info'
    }));
  };

  const handleDeselectWord = (e) => {
    e.stopPropagation();
    setIsFadingOut(true);

    setTimeout(() => {
      // Mettre à jour Redux (la désélection sera effective au prochain tour)
      dispatch(toggleWordSelection({
        listId: activeListId,
        wordId: currentWord.id
      }));
      dispatch(addToast({
        message: 'Mot désélectionné',
        type: 'info'
      }));

      // Continuer l'entraînement comme si on avait cliqué sur "Continuer"
      if (currentWordIndex + 1 >= shuffledWords.length) {
        // Dernier mot du tour
        setShowRoundComplete(true);
      } else {
        // Passer au mot suivant
        setCurrentWordIndex((prev) => prev + 1);
        setIsRevealed(false);
      }

      setIsFadingOut(false);
    }, 300);
  };

  const handleToggleInversion = () => {
    if (isRevealed) {
      // Si la carte est retournée, on ajoute une animation de transition
      setIsToggleChanging(true);
      setTimeout(() => {
        dispatch(setCardInversionMode(!isFaceInverted));
        setIsToggleChanging(false);
      }, 150);
    } else {
      // Si la carte n'est pas retournée, changement direct
      dispatch(setCardInversionMode(!isFaceInverted));
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
        <div className="flex items-center justify-between mb-2">
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
        {!showRoundComplete && (
          <div className="flex items-center justify-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-300"
                style={{
                  width: `${((currentWordIndex + 1) / initialWordCount) * 100}%`
                }}
              />
            </div>
            <span className="text-xs font-medium text-gray-600 min-w-[3rem] text-right">
              {currentWordIndex + 1}/{initialWordCount}
            </span>
          </div>
        )}
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
        <div className="flex-1 flex flex-col items-center justify-center p-4 gap-4">
          {/* Toggle d'inversion de carte */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-sm font-medium text-gray-600">Kanji → Traduction</span>
            <button
              onClick={handleToggleInversion}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isFaceInverted
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
              aria-label="Inverser la carte"
              title={isFaceInverted ? "Mode: Traduction → Kanji" : "Mode: Kanji → Traduction"}
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium text-gray-600">Traduction → Kanji</span>
          </div>

          {/* Conteneur avec perspective pour l'effet 3D */}
          <div
            className="relative max-w-2xl w-full"
            style={{ perspective: '1000px' }}
          >
            <div
              onClick={handleCardClick}
              className={`
                relative cursor-pointer p-8 rounded-2xl
                border-2 shadow-lg bg-white
                transition-all duration-600
                ${isFadingOut ? 'opacity-50 scale-95' : 'opacity-100'}
                ${
                  !isRevealed
                    ? 'border-purple-300 hover:shadow-xl hover:scale-105 animate-pulse'
                    : 'border-green-300 hover:shadow-xl'
                }
              `}
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipping || isRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
                transition: 'transform 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)'
              }}
            >
              {/* Face avant */}
              <div
                className="absolute inset-0 p-8 rounded-2xl bg-white flex flex-col items-center justify-center"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(0deg)'
                }}
              >
                <div className="text-center">
                  {!isFaceInverted ? (
                    // Mode normal : Kanji en face avant
                    <>
                      <h1 className="text-5xl font-bold text-gray-800 mb-4">
                        {currentWord.kanji}
                      </h1>
                      <p className="text-sm text-gray-400 mt-6">
                        Cliquez pour révéler
                      </p>
                    </>
                  ) : (
                    // Mode inversé : Traduction française en face avant
                    <>
                      <h1 className="text-5xl font-bold text-gray-800 mb-4">
                        {currentWord.meaning}
                      </h1>
                      <p className="text-sm text-gray-400 mt-6">
                        Cliquez pour révéler
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Face arrière */}
              <div
                className={`p-8 rounded-2xl bg-white flex flex-col items-center justify-center transition-opacity duration-300 ${
                  isToggleChanging ? 'opacity-0' : 'opacity-100'
                }`}
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
              >
                <div className="text-center">
                  {!isFaceInverted ? (
                    // Mode normal : Kanji + Romaji + Traduction en face arrière
                    <>
                      <div className="space-y-3">
                        <h1 className="text-5xl font-bold text-gray-800">
                          {currentWord.kanji}
                        </h1>
                        <p className="text-2xl text-gray-500">{currentWord.romaji}</p>
                        <p className="text-xl text-gray-600">{currentWord.meaning}</p>
                      </div>
                      <p className="text-sm text-gray-400 mt-6">
                        Cliquez pour continuer
                      </p>
                    </>
                  ) : (
                    // Mode inversé : Traduction + Kanji + Romaji en face arrière
                    <>
                      <div className="space-y-3">
                        <h1 className="text-5xl font-bold text-gray-800">
                          {currentWord.meaning}
                        </h1>
                        <p className="text-2xl text-gray-500">{currentWord.kanji}</p>
                        <p className="text-2xl text-gray-500">{currentWord.romaji}</p>
                      </div>
                      <p className="text-sm text-gray-400 mt-6">
                        Cliquez pour continuer
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {isRevealed && (
            <button
              onClick={handleDeselectWord}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg transition-all active:scale-95 hover:bg-purple-700"
            >
              Désélectionner
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TrainingView;
