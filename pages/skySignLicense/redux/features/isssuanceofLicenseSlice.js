import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

// Create Entity Adapter
const isssuanceofLicenseAdapter = createEntityAdapter();

// Get Selectors Form Entity Adapter
const isssuanceofLicenseLicenseSelector =
  isssuanceofLicenseAdapter.getSelectors(
    (state) => state.isssuanceofLicense,
  );

// Create Slice
export const isssuanceofLicenseSlice = createSlice({
  // Name For Slice
  name: "isssuanceofLicense",
  initialState: isssuanceofLicenseAdapter.getInitialState(),
  reducers: {
    // Add IsssuanceOfHawkerLicense
    addIsssuanceofLicenseSlice: (state, action) => {
      isssuanceofLicenseAdapter.addOne(state, action.payload);
    },
  },
});

export const { addIsssuanceofLicenseSlice } =
  isssuanceofLicenseSlice.actions;
export default isssuanceofLicenseSlice.reducer;
