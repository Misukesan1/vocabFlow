import { configureStore } from "@reduxjs/toolkit";
import navBarSlice from "./slices/navBarSlice"
import listsSlice from "./slices/listsSlice"

export const store = configureStore({
  reducer: {
    navBar: navBarSlice,
    lists: listsSlice,
  },
});
