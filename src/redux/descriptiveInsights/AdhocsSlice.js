import { createSlice } from "@reduxjs/toolkit";

const initialState = { adhocs: [], isAdhocsUpdated: false };

const savedAdhocsSlice = createSlice({
  name: "savedAdhocs",
  initialState,
  reducers: {
    setSavedAdhocs: (state, action) => {
      state.adhocs = action.payload;
    },
    setIsAdhocsUpdated: (state, action) => {
      state.isAdhocsUpdated = action.payload;
    },
  },
});

const initialAdhocsResult = {
  result: [],
  selectedConditions: {},
};

const adhocsResultSlice = createSlice({
  name: "adhocsResults",
  initialState: initialAdhocsResult,
  reducers: {
    setAdhocsResults: (state, action) => {
      state.result = action.payload;
    },
    setSelectedConditions: (state, action) => {
      state.selectedConditions = action.payload;
    },
  },
});

const initialselectedAdhocs = {
  selectedAdhocs: null,
  openAdhocs: false,
};
const selectedAdhocsSlice = createSlice({
  name: "selectedAdhocsReports",
  initialState: initialselectedAdhocs,
  reducers: {
    setSelectedAdhocs: (state, action) => {
      state.selectedAdhocs = action.payload;
    },
    setOpenAdhocs: (state, action) => {
      state.openAdhocs = action.payload;
    },
  },
});

export const { setSavedAdhocs, setIsAdhocsUpdated } = savedAdhocsSlice.actions;
export const { setAdhocsResults, setSelectedConditions } = adhocsResultSlice.actions;
export const { setSelectedAdhocs, setOpenAdhocs } = selectedAdhocsSlice.actions;

// Export reducers
export const savedAdhocsReducer = savedAdhocsSlice.reducer;
export const adhocsResultsReducer = adhocsResultSlice.reducer;
export const selectedAdhocsReducer = selectedAdhocsSlice.reducer;
