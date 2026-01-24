import { configureStore } from "@reduxjs/toolkit";
import navBarSlice from "./slices/navBarSlice"
import listsSlice from "./slices/listsSlice"
import toastSlice from "./slices/toastSlice"
import storageMiddleware from "./middleware/storageMiddleware"

export const store = configureStore({
  reducer: {
    navBar: navBarSlice,
    lists: listsSlice,
    toast: toastSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(storageMiddleware),
});
