import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

// s2 - Create Entity Adapter
const newMarriageRegistractionAdapter = createEntityAdapter();

// selector
export const newMarriageRegistractionSelector =
  newMarriageRegistractionAdapter.getSelectors(
    (state) => state.newMarriageRegistration,
  );

// ID -.
export const newMarriageRegistractionSelectorId =
  newMarriageRegistractionAdapter.getSelectors(() => EntityId());

// S1 - Create Slice
export const newMarriageRegistrationSlice = createSlice({
  // slice Name

  name: "newMarriageRegistration",
  // initial State -
  initialState: newMarriageRegistractionAdapter.getInitialState(),
  //S3 -reducers
  reducers: {
    // Add - NewMarriageRegistraction
    addNewMarriageRegistraction: (state, action) => {
      newMarriageRegistractionAdapter.addOne(state, action.payload);
      console.log(
        newMarriageRegistractionAdapter.addOne(state, action.payload),
      );
    },

    // // Add All
    addAllNewMarriageRegistraction: (state, action) => {
      newMarriageRegistractionAdapter.addMany(state, action.payload);
      console.log(
        newMarriageRegistractionAdapter.addMany(state, action.payload),
      );
    },
  },
});

export const { addNewMarriageRegistraction, addAllNewMarriageRegistraction } =
  newMarriageRegistrationSlice.actions;
export default newMarriageRegistrationSlice.reducer;
