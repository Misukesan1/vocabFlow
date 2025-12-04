import { saveListsToStorage } from '../utils/localStorage';

/**
 * Redux middleware that automatically saves lists state to localStorage
 * whenever a list or word is created, updated, or deleted
 */
const localStorageMiddleware = (store) => (next) => (action) => {
  // Pass the action to the next middleware/reducer
  const result = next(action);

  // List of actions that should trigger a save to localStorage
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
  ];

  // If the action should trigger a save, save the updated state
  if (actionsToSave.includes(action.type)) {
    const state = store.getState();
    saveListsToStorage(state.lists);
  }

  return result;
};

export default localStorageMiddleware;
