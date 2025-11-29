# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VocabFlow is a React-based vocabulary learning application built with Vite, using Redux Toolkit for state management and Tailwind CSS v4 for styling.

## Build Commands

- **Development server**: `npm run dev` - Starts Vite dev server with hot module replacement
- **Production build**: `npm run build` - Creates optimized production bundle in `dist/`
- **Lint code**: `npm run lint` - Runs ESLint on all JavaScript/JSX files
- **Preview build**: `npm run preview` - Preview production build locally

## Architecture

### State Management

The application uses Redux Toolkit for centralized state management:

- **Store configuration**: [src/store.js](src/store.js) - Configures the Redux store using `configureStore`
- **Slices**: State is organized into slices in [src/slices/](src/slices/)
  - `navBarSlice.js`: Manages navigation state with `activeTab` property and `setTab` action

All slices export their actions and the reducer is exported as default. When adding new state, create a new slice in `src/slices/` and register it in the store's reducer object.

### Navigation Pattern

The app uses a custom tab-based navigation system without a router:

1. [BottomNavBar.jsx](src/componnent/BottomNavBar.jsx) renders navigation tabs (Home, Lists, Stats, Settings)
2. User clicks trigger `setTab` action dispatches to update Redux state
3. [App.jsx](src/App.jsx) conditionally renders pages based on `activeTab` selector from Redux store
4. Pages are located in [src/pages/](src/pages/)

This is a single-page application where all page components are mounted/unmounted based on Redux state rather than URL routing.

### Component Structure

- **Entry point**: [src/main.jsx](src/main.jsx) - Wraps App in Redux Provider and React StrictMode
- **Root component**: [src/App.jsx](src/App.jsx) - Handles conditional page rendering based on navigation state
- **Components**: Located in [src/componnent/](src/componnent/) (note the typo in directory name)
- **Pages**: Four main pages in [src/pages/](src/pages/) - Home, Lists, Stats, Settings

### Styling

- Uses Tailwind CSS v4 via the Vite plugin (`@tailwindcss/vite`)
- Global styles imported in [src/index.css](src/index.css) with `@import "tailwindcss"`
- Components use Tailwind utility classes directly
- Icons from `lucide-react` package

## ESLint Configuration

ESLint is configured using the flat config format in [eslint.config.js](eslint.config.js):

- Extends React Hooks and React Refresh recommended configs
- Custom rule: `no-unused-vars` allows uppercase variables (pattern `^[A-Z_]`)
- Ignores `dist/` directory
- ECMAScript 2020 with JSX support