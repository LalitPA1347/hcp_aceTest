import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedAllRegCat:[],
  selectedAllSegCat:[],
};

const indicationDropdownSlice = createSlice({
  name: "indicationDropdowns",
  initialState,
  reducers: {
    setAllRegCat: (state, action) => {
      state.selectedAllRegCat = action.payload;
    },
    SetAllSegCat:(state,action)=>{
      state.selectedAllSegCat=action.payload
    },
  },
});

export const {
  setAllRegCat,
  SetAllSegCat,
  // setSegmentRuleList,
} = indicationDropdownSlice.actions;
export default indicationDropdownSlice.reducer;

