import { createSlice } from '@reduxjs/toolkit'

const labelSlice = createSlice({
  name: 'labels',
  initialState: {
    language: 'en',
    labels: [],
  },
  reducers: {
    language: (state, action) => {
      state.language = action.payload
    },
    mountLabels: (state, action) => {
      state.labels = action.payload
    },
    unmountLabels: (state, action) => {
      state.labels = []
      state.language = 'en'
    },
  },
})

export const { language, mountLabels, unmountLabels } = labelSlice.actions

export default labelSlice
