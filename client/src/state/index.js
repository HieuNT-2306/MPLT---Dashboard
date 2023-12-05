import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "dark",
  userId: "63701cc1f03239d40b000046",
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