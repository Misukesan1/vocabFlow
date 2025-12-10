import { createSlice } from '@reduxjs/toolkit';
import { nanoid } from '@reduxjs/toolkit';

const initialState = {
  lists: [],
  activeListId: null,
  isTrainingMode: false,
  cardInversionMode: false,
};

const listsSlice = createSlice({
  name: 'lists',
  initialState,
  reducers: {
    // Actions pour les listes
    createList: (state, action) => {
      const newList = {
        id: nanoid(),
        name: action.payload.name,
        createdAt: new Date().toISOString(),
        trainingRounds: 0,
        words: [],
      };
      state.lists.push(newList);
    },

    updateList: (state, action) => {
      const { id, name } = action.payload;
      const list = state.lists.find((list) => list.id === id);
      if (list) {
        list.name = name;
      }
    },

    deleteList: (state, action) => {
      state.lists = state.lists.filter((list) => list.id !== action.payload);
      // Si la liste active est supprimée, réinitialiser activeListId
      if (state.activeListId === action.payload) {
        state.activeListId = null;
        state.isTrainingMode = false;
      }
    },

    // Actions pour les mots
    addWord: (state, action) => {
      const { listId, kanji, romaji, meaning } = action.payload;
      const list = state.lists.find((list) => list.id === listId);
      if (list) {
        const newWord = {
          id: nanoid(),
          kanji,
          romaji,
          meaning,
          isSelected: true,
        };
        list.words.push(newWord);
      }
    },

    updateWord: (state, action) => {
      const { listId, wordId, kanji, romaji, meaning } = action.payload;
      const list = state.lists.find((list) => list.id === listId);
      if (list) {
        const word = list.words.find((word) => word.id === wordId);
        if (word) {
          word.kanji = kanji;
          word.romaji = romaji;
          word.meaning = meaning;
        }
      }
    },

    deleteWord: (state, action) => {
      const { listId, wordId } = action.payload;
      const list = state.lists.find((list) => list.id === listId);
      if (list) {
        list.words = list.words.filter((word) => word.id !== wordId);
      }
    },

    // Actions pour la sélection de mots
    toggleWordSelection: (state, action) => {
      const { listId, wordId } = action.payload;
      const list = state.lists.find((list) => list.id === listId);
      if (list) {
        const word = list.words.find((word) => word.id === wordId);
        if (word) {
          word.isSelected = !word.isSelected;
        }
      }
    },

    toggleAllWordsSelection: (state, action) => {
      const { listId, selectAll } = action.payload;
      const list = state.lists.find((list) => list.id === listId);
      if (list) {
        list.words.forEach((word) => {
          word.isSelected = selectAll;
        });
      }
    },

    // Action pour la navigation
    setActiveList: (state, action) => {
      state.activeListId = action.payload;
    },

    // Actions pour le mode entraînement
    startTraining: (state) => {
      state.isTrainingMode = true;
    },

    exitTraining: (state) => {
      state.isTrainingMode = false;
    },

    incrementTrainingRound: (state, action) => {
      const listId = action.payload;
      const list = state.lists.find((list) => list.id === listId);
      if (list) {
        list.trainingRounds += 1;
      }
    },

    setCardInversionMode: (state, action) => {
      state.cardInversionMode = action.payload;
    },

    // Action pour hydrater l'état depuis localStorage
    hydrateFromStorage: (state, action) => {
      if (action.payload) {
        // Migrer les listes existantes pour ajouter trainingRounds et isSelected
        const lists = action.payload.lists?.map(list => ({
          ...list,
          trainingRounds: list.trainingRounds ?? 0,
          words: list.words?.map(word => ({
            ...word,
            isSelected: word.isSelected ?? true,
          })) || [],
        })) || [];

        state.lists = lists;
        state.activeListId = action.payload.activeListId || null;
        state.cardInversionMode = action.payload.cardInversionMode ?? false;
      }
    },

    // Action pour réinitialiser toutes les données
    resetAll: (state) => {
      state.lists = [];
      state.activeListId = null;
      state.isTrainingMode = false;
      state.cardInversionMode = false;
    },
  },
});

export const {
  createList,
  updateList,
  deleteList,
  addWord,
  updateWord,
  deleteWord,
  toggleWordSelection,
  toggleAllWordsSelection,
  setActiveList,
  startTraining,
  exitTraining,
  incrementTrainingRound,
  setCardInversionMode,
  hydrateFromStorage,
  resetAll,
} = listsSlice.actions;

export default listsSlice.reducer;
