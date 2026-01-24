/**
 * Unified storage manager for VocabFlow
 * Abstracts storage operations with automatic fallback
 * Handles migration from localStorage to IndexedDB
 */

import {
  saveListsToStorage,
  loadListsFromStorage,
  clearListsFromStorage,
} from './localStorage';
import {
  isIndexedDBAvailable,
  saveListsToIndexedDB,
  loadListsFromIndexedDB,
  clearListsFromIndexedDB,
} from './indexedDB';
import { needsMigration, performMigration } from './migration';

let storageType = 'localStorage'; // Default storage type

/**
 * Initializes the storage system
 * Handles automatic migration if necessary
 * @returns {Promise<string>} The storage type being used ('indexedDB' or 'localStorage')
 */
export const initStorage = async () => {
  try {
    // Check if IndexedDB is available
    if (!isIndexedDBAvailable()) {
      console.warn('⚠️ IndexedDB not available, using localStorage');
      storageType = 'localStorage';
      return storageType;
    }

    // Check if migration is needed
    const shouldMigrate = await needsMigration();
    if (shouldMigrate) {
      const migrationSuccess = await performMigration();
      if (!migrationSuccess) {
        console.warn('⚠️ Migration failed, using localStorage');
        storageType = 'localStorage';
        return storageType;
      }
    }

    // Use IndexedDB
    storageType = 'indexedDB';
    console.log('✅ Storage initialized:', storageType);
    return storageType;
  } catch (error) {
    console.error('Error initializing storage:', error);
    storageType = 'localStorage';
    return storageType;
  }
};

/**
 * Saves the app state (abstracted storage operation)
 * @param {Object} listsState - The lists state object from Redux
 * @returns {Promise<void>}
 */
export const saveState = async (listsState) => {
  try {
    if (storageType === 'indexedDB') {
      await saveListsToIndexedDB(listsState);
    } else {
      saveListsToStorage(listsState);
    }
  } catch (error) {
    console.error('Error saving state:', error);
    // Automatic fallback to localStorage
    if (storageType === 'indexedDB') {
      console.warn('⚠️ Falling back to localStorage');
      storageType = 'localStorage';
      saveListsToStorage(listsState);
    }
  }
};

/**
 * Loads the app state (abstracted storage operation)
 * @returns {Promise<Object|null>} The state object or null if not found
 */
export const loadState = async () => {
  try {
    if (storageType === 'indexedDB') {
      return await loadListsFromIndexedDB();
    } else {
      return loadListsFromStorage();
    }
  } catch (error) {
    console.error('Error loading state:', error);
    // Automatic fallback to localStorage
    if (storageType === 'indexedDB') {
      console.warn('⚠️ Falling back to localStorage');
      storageType = 'localStorage';
      return loadListsFromStorage();
    }
    return null;
  }
};

/**
 * Clears all app state (abstracted storage operation)
 * @returns {Promise<void>}
 */
export const clearState = async () => {
  try {
    if (storageType === 'indexedDB') {
      await clearListsFromIndexedDB();
    } else {
      clearListsFromStorage();
    }
  } catch (error) {
    console.error('Error clearing state:', error);
    throw error;
  }
};

/**
 * Returns the current storage type being used
 * @returns {string} 'indexedDB' or 'localStorage'
 */
export const getStorageType = () => storageType;
