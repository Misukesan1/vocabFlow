import { configureStore } from "@reduxjs/toolkit";
import navBarSlice from "./slices/navBarSlice"
import listsSlice from "./slices/listsSlice"
import toastSlice from "./slices/toastSlice"
import localStorageMiddleware from "./middleware/localStorageMiddleware"

export const store = configureStore({
  reducer: {
    navBar: navBarSlice,
    lists: listsSlice,
    toast: toastSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});
