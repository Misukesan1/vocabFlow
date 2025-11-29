import { createSlice } from '@reduxjs/toolkit';
import { nanoid } from '@reduxjs/toolkit';

const initialState = {
  lists: [],
  activeListId: null,
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

    // Action pour la navigation
    setActiveList: (state, action) => {
      state.activeListId = action.payload;
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
  setActiveList,
} = listsSlice.actions;

export default listsSlice.reducer;
