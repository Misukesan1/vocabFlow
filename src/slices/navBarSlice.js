import { createSlice } from "@reduxjs/toolkit";

const navBarSlice = createSlice({
  name: "navBar",
  initialState: {
    activeTab: "home",
  },
  reducers: {
    setTab: (state, action) => {
      state.activeTab = action.payload; // Redux Toolkit permet la mutation “sûre”
    },
  },
});

export const { setTab } = navBarSlice.actions;
export default navBarSlice.reducer;
