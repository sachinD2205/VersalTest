import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

// Create Entity Adapter
const propertyRegistrationAdapter = createEntityAdapter();

// Get Selectors Form Entity Adapter
const propertyRegistrationSelector = propertyRegistrationAdapter.getSelectors(
  (state) => state.propertyRegistration
);

// Create Slice
export const propertyRegistrationSlice = createSlice({
  // Name For Slice
  name: "propertyRegistration",
  initialState: propertyRegistrationAdapter.getInitialState(),
  reducers: {
    // Add addPropertyRegistration
    addPropertyRegistration: (state, action) => {
      propertyRegistrationAdapter.addOne(state, action.payload);
    },
  },
});

export const { addPropertyRegistration } = propertyRegistrationSlice.actions;
export default propertyRegistrationSlice.reducer;
