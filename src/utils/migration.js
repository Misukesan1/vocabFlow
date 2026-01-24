/**
 * Migration utility for VocabFlow
 * Handles automatic migration from localStorage to IndexedDB
 */

import { loadListsFromStorage } from './localStorage';
import { saveListsToIndexedDB, loadListsFromIndexedDB } from './indexedDB';

const MIGRATION_FLAG = 'vocabFlow_migrated';
const MIGRATION_DATE = 'vocabFlow_migration_date';

/**
 * Checks if migration from localStorage to IndexedDB is necessary
 * @returns {Promise<boolean>} True if migration is needed
 */
export const needsMigration = async () => {
  // Check if already migrated
  if (localStorage.getItem(MIGRATION_FLAG) === 'true') {
    return false;
  }

  // Check if IndexedDB data already exists
  try {
    const indexedDBData = await loadListsFromIndexedDB();
    if (indexedDBData) {
      // Mark as migrated since IndexedDB data exists
      localStorage.setItem(MIGRATION_FLAG, 'true');
      return false;
    }
  } catch (error) {
    console.warn('Could not check IndexedDB data:', error);
  }

  // Check if localStorage data exists
  const localStorageData = loadListsFromStorage();
  return localStorageData !== null;
};

/**
 * Performs migration from localStorage to IndexedDB
 * Enriches data with new fields and validates integrity
 * @returns {Promise<boolean>} True if migration succeeded
 */
export const performMigration = async () => {
  try {
    console.log('🔄 Starting migration: localStorage → IndexedDB');

    // Load legacy data from localStorage
    const legacyData = loadListsFromStorage();
    if (!legacyData) {
      console.warn('No data to migrate');
      return false;
    }

    console.log('📦 Data to migrate:', {
      listsCount: legacyData.lists?.length || 0,
      activeListId: legacyData.activeListId,
      cardInversionMode: legacyData.cardInversionMode,
    });

    // Enrich data with default values for missing fields
    const enrichedData = {
      lists: legacyData.lists?.map(list => ({
        ...list,
        trainingRounds: list.trainingRounds ?? 0,
        words: list.words?.map(word => ({
          ...word,
          isSelected: word.isSelected ?? true,
        })) || [],
      })) || [],
      activeListId: legacyData.activeListId || null,
      cardInversionMode: legacyData.cardInversionMode ?? false,
    };

    // Save to IndexedDB
    await saveListsToIndexedDB(enrichedData);

    // Verify data integrity
    const verification = await loadListsFromIndexedDB();
    if (!verification) {
      throw new Error('Data verification failed after migration');
    }

    // Mark as migrated (keep localStorage as backup for 7 days)
    localStorage.setItem(MIGRATION_FLAG, 'true');
    localStorage.setItem(MIGRATION_DATE, new Date().toISOString());

    console.log('✅ Migration successful');
    console.log('📊 Migrated lists:', verification.lists?.length || 0);

    return true;
  } catch (error) {
    console.error('❌ Migration failed:', error);
    return false;
  }
};

/**
 * Cleans up old localStorage data after grace period
 * Keeps localStorage backup for 7 days after migration
 */
export const cleanupAfterMigration = () => {
  const migrationDate = localStorage.getItem(MIGRATION_DATE);
  if (!migrationDate) return;

  const daysSinceMigration =
    (Date.now() - new Date(migrationDate).getTime()) / (1000 * 60 * 60 * 24);

  // Keep backup for 7 days
  if (daysSinceMigration > 7) {
    localStorage.removeItem('vocabFlow_lists');
    console.log('🧹 Old localStorage data cleaned up');
  }
};
