/**
 * IndexedDB utility functions for VocabFlow
 * Handles persistence of lists and words data using IndexedDB
 * Uses the 'idb' library for a cleaner Promise-based API
 */

import { openDB } from 'idb';

const DB_NAME = 'vocabFlowDB';
const DB_VERSION = 1;
const STORE_NAME = 'appState';
const STATE_KEY = 'vocabFlow_state';

/**
 * Checks if IndexedDB is available in the browser
 * @returns {boolean} True if IndexedDB is available
 */
export const isIndexedDBAvailable = () => {
  try {
    return 'indexedDB' in window && window.indexedDB !== null;
  } catch (e) {
    return false;
  }
};

/**
 * Initializes the IndexedDB database
 * Creates the object store if it doesn't exist
 * @returns {Promise<IDBDatabase>} The database instance
 */
export const initDB = async () => {
  if (!isIndexedDBAvailable()) {
    throw new Error('IndexedDB is not available in this browser');
  }

  try {
    const db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Create the object store if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          console.log('📦 IndexedDB object store created');
        }
      },
    });
    return db;
  } catch (error) {
    console.error('Failed to initialize IndexedDB:', error);
    throw error;
  }
};

/**
 * Saves lists state to IndexedDB
 * @param {Object} listsState - The lists state object from Redux
 * @returns {Promise<void>}
 */
export const saveListsToIndexedDB = async (listsState) => {
  try {
    const db = await initDB();

    const stateToSave = {
      id: STATE_KEY,
      ...listsState,
      version: 1,
      lastUpdated: new Date().toISOString(),
    };

    await db.put(STORE_NAME, stateToSave);
    console.log('💾 Data saved to IndexedDB');
  } catch (error) {
    console.error('Failed to save to IndexedDB:', error);
    throw error;
  }
};

/**
 * Loads lists state from IndexedDB
 * @returns {Promise<Object|null>} The lists state object or null if not found
 */
export const loadListsFromIndexedDB = async () => {
  try {
    const db = await initDB();
    const data = await db.get(STORE_NAME, STATE_KEY);

    if (!data) {
      return null;
    }

    // Remove internal metadata before returning
    const { id, version, lastUpdated, ...listsState } = data;
    console.log('📦 Data loaded from IndexedDB');
    return listsState;
  } catch (error) {
    console.error('Failed to load from IndexedDB:', error);
    throw error;
  }
};

/**
 * Clears all data from IndexedDB
 * @returns {Promise<void>}
 */
export const clearListsFromIndexedDB = async () => {
  try {
    const db = await initDB();
    await db.delete(STORE_NAME, STATE_KEY);
    console.log('🗑️ IndexedDB data cleared');
  } catch (error) {
    console.error('Failed to clear IndexedDB:', error);
    throw error;
  }
};
