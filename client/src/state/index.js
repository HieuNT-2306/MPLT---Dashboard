import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "dark",
  userId: "60c9b0b3e6b6b30015f9e8a5",
};

export const globalSlice = createSlice({
 name: "global",
 initialState,
 reducers: {
  setMode: (state) => {
   state.mode = state.mode === "light" ? "dark" : "light";
  },
 },
})

export const { setMode, go } = globalSlice.actions;

export default globalSlice.reducer;