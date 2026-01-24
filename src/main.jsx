import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { Provider } from "react-redux";
import { store } from "./store"
import { hydrateFromStorage } from "./slices/listsSlice"
import { initStorage, loadState } from "./utils/storageManager"

/**
 * Asynchronous application initialization
 * Handles storage initialization and data migration
 */
async function initApp() {
  try {
    // Initialize storage system (handles automatic migration if needed)
    const storageType = await initStorage();
    console.log('📦 Storage system:', storageType);

    // Load persisted data
    const persistedLists = await loadState();

    if (persistedLists) {
      console.log('📦 Data loaded:', persistedLists);
      console.log('📊 Training rounds by list:');
      persistedLists.lists?.forEach(list => {
        console.log(`  - ${list.name}: ${list.trainingRounds || 0} rounds`);
      });

      // Hydrate Redux store
      store.dispatch(hydrateFromStorage(persistedLists));
    } else {
      console.log('📦 No persisted data found');
    }

    // Render application
    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
      </StrictMode>,
    );
  } catch (error) {
    console.error('❌ Application initialization error:', error);

    // Fallback: render app anyway (with empty state)
    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
      </StrictMode>,
    );
  }
}

// Start the application
initApp();
