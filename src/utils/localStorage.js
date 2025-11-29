/**
 * localStorage utility functions for VocabFlow
 * Handles persistence of lists and words data
 */

const STORAGE_KEY = 'vocabFlow_lists';

/**
 * Saves lists state to localStorage
 * @param {Object} listsState - The lists state object from Redux
 */
export const saveListsToStorage = (listsState) => {
  try {
    const serialized = JSON.stringify(listsState);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Failed to save lists to localStorage:', error);
  }
};

/**
 * Loads lists state from localStorage
 * @returns {Object|null} The lists state object or null if not found/invalid
 */
export const loadListsFromStorage = () => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (serialized === null) {
      return null;
    }
    return JSON.parse(serialized);
  } catch (error) {
    console.error('Failed to load lists from localStorage:', error);
    return null;
  }
};

/**
 * Clears lists data from localStorage
 */
export const clearListsFromStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear lists from localStorage:', error);
  }
};
