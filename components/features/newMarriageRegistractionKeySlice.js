import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

// s2
const newMarriageRegestractionKeyAdapter = createEntityAdapter();

// S1 - Slice
export const newMarriageRegistractionKeySlice = createSlice({
  //  Entity Adpater
  name: "newMarriageRegistractionKey",
  // initial State
  initialState: newMarriageRegestractionKeyAdapter.getInitialState(),

  // S3 Reducer
  reducers: {
    // Add ONe
    addNewMarriageRegestractionKey: (state, action) => {
      newMarriageRegestractionKeyAdapter.addOne(state, action.payload);
    },
  },
});

// S4 - Selector
export const newMarriageRegistractionKeySelector =
  newMarriageRegestractionKeyAdapter.getSelectors(
    (state) => state.newMarriageRegistractionKey,
  );

export const { addNewMarriageRegestractionKey } =
  newMarriageRegistractionKeySlice.actions;

export default newMarriageRegistractionKeySlice.reducer;
