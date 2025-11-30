import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { Provider } from "react-redux";
import { store } from "./store"
import { hydrateFromStorage } from "./slices/listsSlice"
import { loadListsFromStorage } from "./utils/localStorage"

// Load persisted data from localStorage on app startup
const persistedLists = loadListsFromStorage();
if (persistedLists) {
  console.log('📦 Données chargées depuis localStorage:', persistedLists);
  console.log('📊 Détail des tours par liste:');
  persistedLists.lists?.forEach(list => {
    console.log(`  - ${list.name}: ${list.trainingRounds || 0} tours`);
  });
  store.dispatch(hydrateFromStorage(persistedLists));
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
