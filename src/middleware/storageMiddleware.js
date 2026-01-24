import { saveState } from '../utils/storageManager';

/**
 * Redux middleware that automatically saves lists state to storage
 * (IndexedDB with localStorage fallback) whenever relevant actions occur
 */
const storageMiddleware = (store) => (next) => (action) => {
  // Pass the action to the next middleware/reducer
  const result = next(action);

  // List of actions that should trigger a save to storage
  const actionsToSave = [
    'lists/createList',
    'lists/updateList',
    'lists/deleteList',
    'lists/addWord',
    'lists/updateWord',
    'lists/deleteWord',
    'lists/incrementTrainingRound',
    'lists/toggleWordSelection',
    'lists/toggleAllWordsSelection',
    'lists/setCardInversionMode',
  ];

  // If the action should trigger a save, save the updated state asynchronously
  // Fire-and-forget: don't block Redux flow
  if (actionsToSave.includes(action.type)) {
    const state = store.getState();

    saveState(state.lists).catch((error) => {
      console.error('Storage middleware error:', error);
    });
  }

  return result;
};

export default storageMiddleware;
