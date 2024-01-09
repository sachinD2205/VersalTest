import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

// Create Entity Adapter
const isssuanceofHawkerLicenseAdapter = createEntityAdapter();

// Get Selectors Form Entity Adapter
const isssuanceofHawkerLicenseSelector =
  isssuanceofHawkerLicenseAdapter.getSelectors(
    (state) => state.isssuanceofHawker,
  );

// Create Slice
export const isssuanceofHawkerLicenseSlice = createSlice({
  // Name For Slice
  name: "isssuanceofHawker",
  initialState: isssuanceofHawkerLicenseAdapter.getInitialState(),
  reducers: {
    // Add IsssuanceOfHawkerLicense
    addIsssuanceofHawkerLicense: (state, action) => {
      isssuanceofHawkerLicenseAdapter.addOne(state, action.payload);
    },
  },
});

export const { addIsssuanceofHawkerLicense } =
  isssuanceofHawkerLicenseSlice.actions;
export default isssuanceofHawkerLicenseSlice.reducer;
