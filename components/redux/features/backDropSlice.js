import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

const backDropEntityAdapter = createEntityAdapter();

// Slice
const backDropSlice = createSlice({
  // Slice Entity Name
  name: "backDrop",

  // Initial State
  initialState: backDropEntityAdapter.getInitialState(),

  // reducers
  reducers: {
    // Add Once
    backDrop: (state, action) => {
      backDropEntityAdapter.addOne(state, action.payload);
    },
  },
});
