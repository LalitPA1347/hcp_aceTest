import { createSlice, createAction, createSelector } from "@reduxjs/toolkit";

export const selectActiveParameters = createSelector(
  (state) => state.dragData.droppedParamsBySource,
  (droppedParamsBySource) => {
    const activeParams = new Set();
    for (const source in droppedParamsBySource) {
      droppedParamsBySource[source].forEach((param) => activeParams.add(param));
    }
    return Array.from(activeParams);
  }
);

export const reorderDroppedParams = createAction(
  "dragData/reorderDroppedParams"
);

const reportsStaleState = {
  dragData: [], // Array to store drag data
  KpisData: [],
  actionType: null,
  selectedkpiData: ['NRX', 'Patient Count', 'Total Calls'],
  Kpiconfigs: {},
  droppedParamsBySource: {},
  selectedDataSources: [],
};

const dragStaleSlice = createSlice({
  name: "dragData",
  initialState: reportsStaleState,
  reducers: {
    setDragData: (state, action) => {
      state.dragData = action.payload.dragData; // Update dragData
      state.actionType = action.payload.actionType; // Set action type
    },
    clearDragData: (state) => {
      state.dragData = []; // Clear the array
      state.actionType = null; // Reset action type
    },
    setKpisData: (state, action) => {
      state.KpisData = action.payload; // Action to update filtered KPIs
    },
    setKpiconfigs: (state, action) => {
      state.Kpiconfigs = action.payload; // Action to update filtered KPIs
    },
    setSelectedKpiData: (state, action) => {
      state.selectedkpiData = action.payload; // Action to update filtered KPIs
    },
    setSelectedDataSources: (state, action) => {
      state.selectedDataSources = action.payload;
    },
    addDroppedParam: (state, action) => {
      // Add this reducer
      const { param, sources } = action.payload;
      sources.forEach((source) => {
        const trimmedSource = source.trim();
        if (!state.droppedParamsBySource[trimmedSource]) {
          state.droppedParamsBySource[trimmedSource] = [];
        }
        if (!state.droppedParamsBySource[trimmedSource].includes(param)) {
          state.droppedParamsBySource[trimmedSource].push(param);
        }
      });
    },
    removeDroppedParam: (state, action) => {
      const { param, source } = action.payload;
      if (state.droppedParamsBySource[source]) {
        state.droppedParamsBySource[source] = state.droppedParamsBySource[
          source
        ].filter((p) => p !== param);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(reorderDroppedParams, (state, action) => {
      const { dataSource, params } = action.payload;
      if (state.droppedParamsBySource[dataSource]) {
        state.droppedParamsBySource[dataSource] = params;
      }
    });
  },
});

export const {
  setDragData,
  clearDragData,
  setKpisData,
  setSelectedKpiData,
  setKpiconfigs,
  setSelectedDataSources,
  addDroppedParam,
  removeDroppedParam,
} = dragStaleSlice.actions;

export const dragDataReducer = dragStaleSlice.reducer;
