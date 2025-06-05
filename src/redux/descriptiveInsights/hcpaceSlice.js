import {
  createSlice,
  createAction,
  createSelector,
  nanoid,
} from "@reduxjs/toolkit";
// nanoid will be used to generate unique IDs for each chip

export const selectActiveParameters = createSelector(
  (state) => state.dragData.droppedParamsBySource,
  (droppedParamsBySource) => {
    const activeParams = new Set();
    for (const source in droppedParamsBySource) {
      // Now, each 'param' is an object, so access its 'name' property
      droppedParamsBySource[source].forEach((chip) => {
        if (chip.type === "param") {
          // Only add regular parameters to this set if needed for sidebar
          activeParams.add(chip.name);
        }
      });
    }
    return Array.from(activeParams);
  }
);

export const reorderDroppedParams = createAction(
  "dragData/reorderDroppedParams"
);

// We will no longer need a separate action for adding custom filter chips
// since they will be added via addDroppedParam as well, just with a different 'type'.
// The setCustomFilterChips state and its related updates will be removed from components.

const reportsStaleState = {
  dragData: [], // Array to store drag data (still just param names for sidebar tracking)
  KpisData: [],
  actionType: null,
  selectedkpiData: ["NRX", "Patient Count", "Total Calls"],
  Kpiconfigs: {},
  // droppedParamsBySource will now hold objects
  droppedParamsBySource: {},
  selectedDataSources: [],
  savedFlowChartData: [],
};

const dragStaleSlice = createSlice({
  name: "dragData",
  initialState: reportsStaleState,
  reducers: {
    setDragData: (state, action) => {
      state.dragData = action.payload.dragData;
      state.actionType = action.payload.actionType;
    },
    clearDragData: (state) => {
      state.dragData = [];
      state.actionType = null;
    },
    setKpisData: (state, action) => {
      state.KpisData = action.payload;
    },
    setKpiconfigs: (state, action) => {
      state.Kpiconfigs = action.payload;
    },
    setSelectedKpiData: (state, action) => {
      state.selectedkpiData = action.payload;
    },
    setSelectedDataSources: (state, action) => {
      state.selectedDataSources = action.payload;
    },
    // Modified addDroppedParam to handle both regular params and custom filters
    addDroppedParam: (state, action) => {
      const { chip, sources, dataSource } = action.payload; // chip is now an object, sources/dataSource indicates where to add
      const id = chip.id || nanoid(); // Ensure chip has a unique ID, create if not provided

      // If 'dataSource' is provided, it means a direct drop into a specific source
      if (dataSource) {
        const trimmedSource = dataSource.trim();
        if (!state.droppedParamsBySource[trimmedSource]) {
          state.droppedParamsBySource[trimmedSource] = [];
        }
        // Ensure we don't add duplicates based on ID
        if (
          !state.droppedParamsBySource[trimmedSource].some((c) => c.id === id)
        ) {
          state.droppedParamsBySource[trimmedSource].push({ ...chip, id });
        }
      } else if (sources && sources.length > 0) {
        // This is for regular parameters from the sidebar that might apply to multiple sources
        sources.forEach((source) => {
          const trimmedSource = source.trim();
          if (!state.droppedParamsBySource[trimmedSource]) {
            state.droppedParamsBySource[trimmedSource] = [];
          }
          // Ensure we don't add duplicates based on ID or name for 'param' type
          // If it's a regular param, we want to avoid adding the same param name multiple times to a source
          // For custom filters, ID is unique so it's fine.
          const isDuplicateParam =
            chip.type === "param" &&
            state.droppedParamsBySource[trimmedSource].some(
              (c) => c.type === "param" && c.name === chip.name
            );
          if (
            !isDuplicateParam &&
            !state.droppedParamsBySource[trimmedSource].some((c) => c.id === id)
          ) {
            state.droppedParamsBySource[trimmedSource].push({ ...chip, id });
          }
        });
      }
    },
    // Modified removeDroppedParam to remove by chip ID or by type/name combination
    removeDroppedParam: (state, action) => {
      const { chipId, paramName, dataSource } = action.payload; // Can remove by ID or by paramName + dataSource
      if (dataSource && state.droppedParamsBySource[dataSource]) {
        state.droppedParamsBySource[dataSource] = state.droppedParamsBySource[
          dataSource
        ].filter((chip) => {
          if (chipId) {
            return chip.id !== chipId;
          }
          // Fallback for old param removal logic if paramName is still passed without ID
          // This is less robust as multiple custom filters could have the same 'name' but different IDs.
          // It's better to always use chip.id for removal.
          if (paramName && chip.type === "param") {
            return chip.name !== paramName;
          }
          return true; // Keep if no matching criteria
        });
      } else if (paramName) {
        // For sidebar removal across all sources if needed, assuming paramName is for 'param' type
        for (const source in state.droppedParamsBySource) {
          state.droppedParamsBySource[source] = state.droppedParamsBySource[
            source
          ].filter((chip) =>
            chip.type === "param" ? chip.name !== paramName : true
          );
        }
      }
    },
    setFlowChartData: (state, action) => {
      state.savedFlowChartData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(reorderDroppedParams, (state, action) => {
      const { dataSource, chips } = action.payload; // Renamed 'params' to 'chips' for clarity
      if (state.droppedParamsBySource[dataSource]) {
        state.droppedParamsBySource[dataSource] = chips; // 'chips' array already contains the reordered objects
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
  setFlowChartData
} = dragStaleSlice.actions;

export const dragDataReducer = dragStaleSlice.reducer;
