# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VocabFlow is a React-based **Japanese vocabulary learning application** built with Vite, using Redux Toolkit for state management and Tailwind CSS v4 for styling.

The application helps users memorize Japanese vocabulary through custom lists and an interactive flashcard training system. Each word contains:
- **Kanji**: Japanese characters
- **Romaji**: Romanized pronunciation
- **Meaning**: French translation

## Build Commands

- **Development server**: `npm run dev` - Starts Vite dev server with hot module replacement
- **Production build**: `npm run build` - Creates optimized production bundle in `dist/`
- **Lint code**: `npm run lint` - Runs ESLint on all JavaScript/JSX files
- **Preview build**: `npm run preview` - Preview production build locally
- **Deploy to GitHub Pages**: `npm run deploy` - Builds and deploys to gh-pages branch

## Core Features

### 1. List Management
Users can create, edit, and delete vocabulary lists. Each list contains multiple Japanese words and tracks training progress.

### 2. Word Management
Full CRUD operations for words within lists. Each word has kanji, romaji, and French meaning. Users can select/deselect words to customize their training sessions.

### 3. Training System
Interactive flashcard system with:
- **Two modes**: Normal (kanji → meaning) and inverted (meaning → kanji)
- **3D card flip animations** when revealing answers
- **Progress tracking** with visual progress bar and round counter
- **Dynamic word pool**: Only selected words appear in training
- **Mid-session deselection**: Remove words during training

### 4. Statistics & Analytics
Visual dashboard showing:
- Total lists, words, and training rounds
- Most trained lists
- Charts: Words per list, training rounds per list, selected vs unselected words

### 5. Data Persistence
Dual-storage system with automatic fallback:
- **Primary**: IndexedDB (for larger datasets)
- **Fallback**: localStorage (when IndexedDB unavailable)
- **Auto-migration**: Migrates data from localStorage to IndexedDB when available
- **Auto-save**: Redux middleware triggers saves on state changes

### 6. User Notifications
Toast notification system for action feedback (success, error, info messages).

## Architecture

### State Management

The application uses Redux Toolkit with three slices in [src/slices/](src/slices/):

1. **`navBarSlice.js`** - Navigation state (`activeTab`: 'home', 'lists', 'stats', 'settings')
2. **`listsSlice.js`** - Core app state (lists, words, training mode, selection state)
3. **`toastSlice.js`** - Notification state

Store configuration in [src/store.js](src/store.js) includes `storageMiddleware` for automatic persistence.

### Navigation Pattern

Custom tab-based navigation **without a router**:
1. [BottomNavBar.jsx](src/componnent/BottomNavBar.jsx) dispatches `setTab` actions
2. [App.jsx](src/App.jsx) conditionally renders pages based on Redux `activeTab`
3. Bottom nav hides during training mode

This is a single-page application with state-driven page rendering.

### View Hierarchy

The Lists page ([src/pages/Lists.jsx](src/pages/Lists.jsx)) uses a three-level view system:

1. **ListsView**: Grid of all lists (when no list selected)
2. **ListDetailView**: Individual list with words (when list selected, training inactive)
3. **TrainingView**: Flashcard interface (when training active)

View switching is controlled by `activeListId` and `isTrainingMode` Redux state.

### Data Persistence Layer

Located in [src/utils/](src/utils/):

- **`storageManager.js`**: Unified API with `initStorage()`, `saveState()`, `loadState()`, `clearState()`
- **`indexedDB.js`**: IndexedDB operations using `idb` library
- **`localStorage.js`**: localStorage operations
- **`migration.js`**: Detects and migrates localStorage data to IndexedDB
- **`storageMiddleware.js`**: Redux middleware that auto-saves on relevant actions

### Component Structure

- **Entry point**: [src/main.jsx](src/main.jsx) - Initializes storage and Redux Provider
- **Root component**: [src/App.jsx](src/App.jsx) - Page routing and training mode UI
- **Components**: [src/componnent/](src/componnent/) (note: typo in directory name)
  - `listsPage/` - List and training components (`ListsView`, `ListDetailView`, `TrainingView`, modals, cards)
  - Root level - `BottomNavBar`, `Toast`, `ToastContainer`, `ConfirmModal`
- **Pages**: [src/pages/](src/pages/) - `Home`, `Lists`, `Stats`, `Settings`

### Styling

- **Framework**: Tailwind CSS v4 via `@tailwindcss/vite` plugin
- **Configuration**: [src/index.css](src/index.css) imports Tailwind with `@import "tailwindcss"`
- **Icons**: `lucide-react` package
- **Custom animations**: Defined in [src/index.css](src/index.css) for card flips, slides, fades

## Key Technical Decisions

### Why IndexedDB + localStorage fallback?
- IndexedDB scales better for large datasets
- localStorage ensures compatibility and fallback
- Migration path from earlier localStorage-only versions

### Why no routing library?
- Simple four-page structure doesn't need react-router
- Redux already manages navigation state
- Better performance without route matching

### Why custom storage middleware?
- Automatic persistence without manual save calls
- Only relevant actions trigger saves
- Non-blocking async saves

## Data Flow

### Creating a word
User form → `addWord` action → Reducer updates state → Middleware saves to storage → UI updates

### Starting training
"Start Training" click → `startTraining()` action → `isTrainingMode: true` → `App.jsx` hides nav → `Lists.jsx` renders `TrainingView` → Filters selected words → Shuffles and displays

### Word deselection during training
"Deselect" click → `toggleWordSelection()` → Middleware saves → TrainingView filters → Updates card pool or shows "all deselected" screen

## ESLint Configuration

[eslint.config.js](eslint.config.js) uses flat config format:
- Extends React Hooks and React Refresh configs
- Allows uppercase unused vars (pattern `^[A-Z_]`)
- Ignores `dist/`

## Important Notes

- **Directory typo**: Components are in `componnent/` (double 'n') - maintain consistency
- **French UI**: All user-facing text is in French
- **Storage initialization**: `initStorage()` must run before Redux hydration in [src/main.jsx](src/main.jsx)
- **Word structure**: Always maintain kanji, romaji, meaning fields
