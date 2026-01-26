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
  const listCategory = list?.category || 'words';

  const [shuffledWords, setShuffledWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [showRoundComplete, setShowRoundComplete] = useState(false);
  const [isRoundAnimating, setIsRoundAnimating] = useState(false);
  const [initialWordCount, setInitialWordCount] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isToggleChanging, setIsToggleChanging] = useState(false);
  const [showAllDeselected, setShowAllDeselected] = useState(false);
  const [slideDirection, setSlideDirection] = useState(null); // 'out', 'in', ou null

  // Fonctions helpers pour le contenu dynamique selon la catégorie
  const getFrontContent = (word, category, inverted) => {
    if (!inverted) {
      // Mode normal : afficher la "question"
      switch(category) {
        case 'words':
        case 'kanji':
          return word.kanji;
        case 'verbs':
          return word.infinitive;
        default:
          return word.kanji;
      }
    } else {
      // Mode inversé : afficher la "réponse"
      switch(category) {
        case 'words':
        case 'kanji':
          return word.meaning;
        case 'verbs':
          return word.politeForm;
        default:
          return word.meaning;
      }
    }
  };

  const getBackContent = (word, category, inverted) => {
    if (!inverted) {
      // Mode normal : afficher la réponse complète
      switch(category) {
        case 'words':
          return { main: word.kanji, sub1: word.romaji, sub2: word.meaning };
        case 'kanji':
          return {
            main: word.kanji,
            isKanji: true,
            kunReading: word.kunReading || 'N/A',
            kunExample: word.kunExample || 'N/A',
            onReading: word.onReading || 'N/A',
            onExample: word.onExample || 'N/A',
            meaning: word.meaning
          };
        case 'verbs':
          return {
            main: word.infinitive,
            isVerb: true,
            progressive: word.progressive,
            politeForm: word.politeForm,
            meaning: word.meaning
          };
        default:
          return { main: word.kanji, sub1: word.romaji, sub2: word.meaning };
      }
    } else {
      // Mode inversé : afficher la question complète
      switch(category) {
        case 'words':
          return { main: word.meaning, sub1: word.kanji, sub2: word.romaji };
        case 'kanji':
          return {
            main: word.meaning,
            isKanjiInverted: true,
            kanji: word.kanji,
            kunReading: word.kunReading || 'N/A',
            kunExample: word.kunExample || 'N/A',
            onReading: word.onReading || 'N/A',
            onExample: word.onExample || 'N/A'
          };
        case 'verbs':
          return {
            main: word.meaning,
            isVerbInverted: true,
            infinitive: word.infinitive,
            progressive: word.progressive,
            politeForm: word.politeForm
          };
        default:
          return { main: word.meaning, sub1: word.kanji, sub2: word.romaji };
      }
    }
  };

  // Mélange les mots à chaque nouveau tour
  useEffect(() => {
    if (list && list.words.length > 0) {
      // Filtrer uniquement les mots sélectionnés
      const selectedWords = list.words.filter(word => word.isSelected);

      if (selectedWords.length === 0) {
        setShowAllDeselected(true);
        setShuffledWords([]);
        return;
      }

      const shuffled = [...selectedWords].sort(() => Math.random() - 0.5);
      setShuffledWords(shuffled);
      setInitialWordCount(shuffled.length);
      setCurrentWordIndex(0);
      setIsRevealed(false);
      setShowAllDeselected(false);
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

  if (!list) {
    return null;
  }
  // Ne pas retourner null pour shuffledWords vide - géré par showAllDeselected

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
      // Révéler la carte (flip 3D reste ici)
      setIsFlipping(true);
      setTimeout(() => {
        setIsRevealed(true);
        setIsFlipping(false);
      }, 200); // Moitié de l'animation (400ms total)
    } else {
      // Carte révélée → Passer au mot suivant avec animation Slide
      if (currentWordIndex + 1 >= shuffledWords.length) {
        // Dernier mot du tour
        setShowRoundComplete(true);
        dispatch(addToast({
          message: `Tour ${currentRound} terminé !`,
          type: 'success'
        }));
      } else {
        // Animation Slide pour passer au mot suivant
        setSlideDirection('out');

        setTimeout(() => {
          setCurrentWordIndex((prev) => prev + 1);
          setIsRevealed(false);
          setSlideDirection('in');

          setTimeout(() => {
            setSlideDirection(null);
          }, 400);
        }, 400);
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

    // Sauvegarder l'ID du mot actuel avant de changer d'index
    const wordToDeselectId = currentWord.id;

    // Vérifier si c'était le dernier mot sélectionné
    const remainingSelectedWords = list.words.filter(word =>
      word.isSelected && word.id !== currentWord.id
    );

    if (remainingSelectedWords.length === 0) {
      // Désélectionner immédiatement car on va vers l'écran "tous désélectionnés"
      dispatch(toggleWordSelection({
        listId: activeListId,
        wordId: wordToDeselectId
      }));
      dispatch(addToast({
        message: 'Mot désélectionné',
        type: 'info'
      }));
      setShowAllDeselected(true);
      return;
    }

    // ÉTAPE 1 : Déclencher l'animation de sortie (slide out left)
    setSlideDirection('out');

    // ÉTAPE 2 : Attendre 400ms (fin de l'animation) avant de changer de mot
    setTimeout(() => {
      // Désélectionner le mot
      dispatch(toggleWordSelection({
        listId: activeListId,
        wordId: wordToDeselectId
      }));
      dispatch(addToast({
        message: 'Mot désélectionné',
        type: 'info'
      }));

      // Vérifier s'il faut afficher la fin du tour
      if (currentWordIndex + 1 >= shuffledWords.length) {
        setShowRoundComplete(true);
        setSlideDirection(null);
      } else {
        // Passer au mot suivant et déclencher l'animation d'entrée (slide in right)
        setCurrentWordIndex((prev) => prev + 1);
        setIsRevealed(false);
        setSlideDirection('in');

        // Réinitialiser slideDirection après l'animation d'entrée
        setTimeout(() => {
          setSlideDirection(null);
        }, 400);
      }
    }, 400);
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

      {/* Training Card ou Messages */}
      {showAllDeselected ? (
        // Écran tous mots désélectionnés
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Tous les mots sont désélectionnés
            </h2>
            <p className="text-gray-500 mb-8">
              Vous avez désélectionné tous les mots de cette liste.
            </p>
            <button
              onClick={handleExitTraining}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl font-medium transition-all active:scale-95 hover:bg-purple-700"
            >
              Retour à la liste
            </button>
          </div>
        </div>
      ) : showRoundComplete ? (
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
      ) : shuffledWords.length > 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4 gap-4">
          {/* Toggle d'inversion de carte */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-sm font-medium text-gray-600">
              {listCategory === 'verbs' ? 'Infinitif → Poli' : 'Kanji → Traduction'}
            </span>
            <button
              onClick={handleToggleInversion}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isFaceInverted
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
              aria-label="Inverser la carte"
              title={isFaceInverted ? "Mode inversé" : "Mode normal"}
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium text-gray-600">
              {listCategory === 'verbs' ? 'Poli → Infinitif' : 'Traduction → Kanji'}
            </span>
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
                ${slideDirection === 'out' ? 'animate-slide-out-left' : ''}
                ${slideDirection === 'in' ? 'animate-slide-in-right' : ''}
                ${
                  !isRevealed
                    ? 'border-purple-300 hover:shadow-xl hover:scale-105 animate-pulse'
                    : 'border-green-300 hover:shadow-xl'
                }
              `}
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipping || isRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
                transition: slideDirection ? 'none' : 'transform 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)'
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
                  <h1 className="text-5xl font-bold text-gray-800 mb-4">
                    {getFrontContent(currentWord, listCategory, isFaceInverted)}
                  </h1>
                  <p className="text-sm text-gray-400 mt-6">
                    Cliquez pour révéler
                  </p>
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
                  {(() => {
                    const content = getBackContent(currentWord, listCategory, isFaceInverted);

                    // Rendu spécial pour les kanji (mode normal)
                    if (content.isKanji) {
                      return (
                        <div className="space-y-3">
                          <h1 className="text-5xl font-bold text-gray-800">{content.main}</h1>
                          <p className="text-xl text-gray-500">Kun: {content.kunReading} <span className="font-bold">(ex : {content.kunExample})</span></p>
                          <p className="text-xl text-gray-500">On: {content.onReading} <span className="font-bold">(ex : {content.onExample})</span></p>
                          <p className="text-lg text-gray-600">{content.meaning}</p>
                        </div>
                      );
                    }

                    // Rendu spécial pour les kanji (mode inversé)
                    if (content.isKanjiInverted) {
                      return (
                        <div className="space-y-3">
                          <h1 className="text-5xl font-bold text-gray-800">{content.main}</h1>
                          <p className="text-2xl text-gray-500">{content.kanji}</p>
                          <p className="text-xl text-gray-500">Kun: {content.kunReading} <span className="font-bold">(ex : {content.kunExample})</span></p>
                          <p className="text-xl text-gray-500">On: {content.onReading} <span className="font-bold">(ex : {content.onExample})</span></p>
                        </div>
                      );
                    }

                    // Rendu spécial pour les verbes (mode normal)
                    if (content.isVerb) {
                      return (
                        <div className="space-y-3">
                          <h1 className="text-5xl font-bold text-gray-800">{content.main}</h1>
                          <p className="text-xl text-gray-500">En action: {content.progressive}</p>
                          <p className="text-xl text-gray-500">Poli: {content.politeForm}</p>
                          <p className="text-lg text-gray-600">{content.meaning}</p>
                        </div>
                      );
                    }

                    // Rendu spécial pour les verbes (mode inversé)
                    if (content.isVerbInverted) {
                      return (
                        <div className="space-y-3">
                          <h1 className="text-5xl font-bold text-gray-800">{content.main}</h1>
                          <p className="text-2xl text-gray-500">{content.infinitive}</p>
                          <p className="text-xl text-gray-500">En action: {content.progressive}</p>
                          <p className="text-xl text-gray-500">Poli: {content.politeForm}</p>
                        </div>
                      );
                    }

                    // Rendu standard pour words
                    return (
                      <div className="space-y-3">
                        <h1 className="text-5xl font-bold text-gray-800">{content.main}</h1>
                        {content.sub1 && <p className="text-2xl text-gray-500">{content.sub1}</p>}
                        {content.sub2 && <p className="text-xl text-gray-600">{content.sub2}</p>}
                        {content.sub3 && <p className="text-lg text-gray-500">{content.sub3}</p>}
                      </div>
                    );
                  })()}
                  <p className="text-sm text-gray-400 mt-6">
                    Cliquez pour continuer
                  </p>
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
      ) : null}
    </div>
  );
};

export default TrainingView;
