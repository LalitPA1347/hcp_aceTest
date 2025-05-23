import { configureStore } from "@reduxjs/toolkit";
import tableReducer from "./descriptiveInsights/tableSlice";
// import isSelectedValuesReducer from "./selectedValuesSlice";

import { reportsStaleReducer } from "./descriptiveInsights/reportsSlice";

import { dragDataReducer } from "./descriptiveInsights/hcpaceSlice";

const store = configureStore({
  reducer: {
    reportsStale: reportsStaleReducer,
    dragData: dragDataReducer,
    table: tableReducer,
  },
});

export default store;
